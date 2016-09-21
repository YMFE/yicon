import fontBuilder from 'iconfont-builder';
import invariant from 'invariant';

// import py from 'pinyin';

import { logRecorder } from './log';
import { seq, Repo, Icon, RepoVersion, User, ProjectVersion } from '../../model';
import { isPlainObject } from '../../helpers/utils';
import { saveOriginalSVG } from '../../helpers/fs';
import { iconStatus } from '../../constants/utils';
import { ICON_NAME, ICON_TAG } from '../../constants/validate';

export function* getById(next) {
  const { icons } = this.param;

  this.state.respond = yield Icon.findAll({
    attributes: ['id', 'name', 'path', 'oldId', 'newId'],
    where: { id: { $in: icons } },
  });

  yield next;
}

export function* getByCondition(next) {
  const { q } = this.param;

  invariant(!isPlainObject(this.query), '必须传入查询条件');
  invariant(q !== '', '参数 q 不能为空字符串');

  const regExp = /^&#x(e|f)[0-9a-f]{3};$/i;
  const query = decodeURIComponent(q);
  const isCode = regExp.test(query);
  let icons = null;
  if (isCode) {
    const code = query.replace(/[^0-9a-f]+/ig, '');
    icons = yield Icon.findAndCountAll({
      where: {
        status: { $gte: iconStatus.RESOLVED },
        code: parseInt(code, 16),
      },
      include: [{ model: Repo }],
    });
  } else {
    const queryKey = `%${query}%`;
    icons = yield Icon.findAndCountAll({
      where: {
        status: { $gte: iconStatus.RESOLVED },
        $or: {
          name: { $like: queryKey },
          tags: { $like: queryKey },
        },
      },
      include: [{ model: Repo }],
    });
  }
  let data = [];
  icons.rows.forEach(v => {
    const id = v.repositories[0].id;
    if (!data[id]) data[id] = Object.assign({}, { id, name: v.repositories[0].name, icons: [] });
    data[id].icons.push(v);
  });
  this.state.respond = this.state.respond || {};
  data = data.filter(v => v);
  let i = 0;
  const len = data.length;
  for (; i < len; i++) {
    data[i].icons = data[i].icons.map(value =>
      Object.assign({}, { id: value.id, name: value.name, code: value.code, path: value.path }));
  }
  this.state.respond.data = data;
  this.state.respond.totalCount = icons.count;
  this.state.respond.queryKey = encodeURI(q);
  yield next;
}

const getFileName = name => (name ? name.replace(/\.svg$/, '') : '迷の文件');

/**
 * 上传图标至图标库，插入 Icon 表中，但不建立表与图标的关联
 * 这里不记录日志，提交到库里再记录
 */
export function* uploadIcons(next) {
  const { userId } = this.state.user;
  invariant(
    this.req.files && this.req.files.length,
    '未获取上传的图标文件，请检查 formdata 的 icon 字段'
  );
  // 处理传入文件
  const param = {
    icons: this.req.files.map(file => {
      const { originalname, buffer } = file;
      const name = getFileName(originalname);
      return { name, buffer };
    }),
    // 标记只返回图标信息数据
    writeFiles: false,
  };

  yield saveOriginalSVG(param.icons);

  let icons;
  try {
    icons = yield fontBuilder(param);
  } catch (e) {
    invariant(false, '读取 svg 文件内容有误，请检查文件');
  }

  const data = icons.map(icon => ({
    name: icon.name,
    path: icon.d,
    status: iconStatus.UPLOADED,
    uploader: userId,
  }));

  yield Icon.bulkCreate(data);

  // TODO: 看一下上传失败是否会直接抛出异常
  this.state.respond = '图标上传成功';

  yield next;
}

/**
 * 上传替换文件的时候，还是将替换文件插入到库里比较好
 * 假如用户放弃了替换，图标状态依然为 REPLACING
 * 但任何页面查到 REPLACING 状态的图标都应标记为放弃替换
 */
export function* uploadReplacingIcon(next) {
  const { userId } = this.state.user;
  invariant(
    this.req.file,
    '未获取上传的图标文件，请检查 formdata 的 icon 字段'
  );
  const { originalname, buffer } = this.req.file;
  const name = getFileName(originalname);
  const param = {
    icons: [{ name, buffer }],
    writeFiles: false,
  };
  let icons;
  try {
    icons = yield fontBuilder(param);
  } catch (e) {
    invariant(false, '读取 svg 文件内容有误，请检查文件');
  }
  const icon = icons[0];
  const iconData = yield Icon.create({
    name: icon.name,
    path: icon.d,
    status: iconStatus.REPLACING,
    uploader: userId,
  });

  this.state.respond = {
    replaceId: iconData.id,
  };

  yield next;
}

/**
 * 将 A 替换为 B，逻辑是：
 * 1. 将 A 除 path 以外的全部信息赋值给 B
 * 2. B 的 oldId 指向 A，A 的 newId 指向 B
 * 3. 将 RepoVersion 关联表中所有 0.0.0 且有包含 A 的关联替换成 B
 * 4. 将 ProjectVersion 关联表中所有 0.0.0 且有包含 A 的关联替换成 B
 * 5. 更新大库的 updatedAt
 */
export function* replaceIcon(next) {
  const { fromId, toId, name, tags } = this.param;
  const { userId } = this.state.user;
  // 要检验，to 必须是 REPLACING 状态，from 必须是 RESOVLED 状态
  const from = yield Icon.findOne({ where: { id: fromId } });
  const to = yield Icon.findOne({ where: { id: toId } });
  const repos = yield from.getRepositories();

  invariant(
    from.status === iconStatus.RESOLVED,
    `被替换的图标 ${from.name} 并非审核通过的线上图标`
  );
  invariant(
    to.status === iconStatus.REPLACING,
    `替换的新图标 ${to.name} 并非待替换状态的图标`
  );
  invariant(
    repos.length,
    `被替换的图标 ${from.name} 竟然不属于任何一个大库`
  );
  invariant(ICON_NAME.reg.test(name), ICON_NAME.message);
  invariant(ICON_TAG.reg.test(tags), ICON_TAG.message);

  const fromName = from.name;
  const toName = to.name;
  const { code, fontClass } = from;
  const repoVersion = yield RepoVersion.findOne({ where: { iconId: fromId } });

  yield seq.transaction(transaction =>
    to.update({
      name,
      fontClass,
      tags,
      code,
      oldId: fromId,
      applyTime: +new Date,
      status: iconStatus.RESOLVED,
    }, { transaction })
    .then(() => from.update({
      newId: toId, status: iconStatus.REPLACED,
    }, { transaction }))
    .then(() => repos[0].update({ updatedAt: new Date }, { transaction }))
    .then(() => RepoVersion.update(
      { iconId: toId, version: '0.0.0' },
      { where: { version: '0.0.0', iconId: fromId }, transaction }
    ))
    .then(() => ProjectVersion.update(
      { iconId: toId, version: '0.0.0' },
      { where: { version: '0.0.0', iconId: fromId }, transaction }
    ))
    .then(() => {
      const log = {
        params: {
          iconFrom: { id: fromId, name: fromName },
          iconTo: { id: toId, name: toName },
        },
        type: 'REPLACE',
        loggerId: repoVersion.repositoryId,
      };
      return logRecorder(log, transaction, userId);
    })
  );

  yield next;
}

/**
 * 提交图标至待审核状态
 */
export function* submitIcons(next) {
  const { repoId, icons } = this.param;
  const { userId } = this.state.user;
  // 预处理，防止有不传 id、repoId 的情况
  invariant(
    !isNaN(repoId),
    `期望传入合法 repoId，目前传入的是 ${repoId}`
  );

  icons.forEach(icon => {
    invariant(
      !isNaN(icon.id),
      `icons 数组期望传入合法 id，目前传入的是 ${icon.id}`
    );
  });

  const repo = yield Repo.findOne({ where: { id: repoId } });

  // 这里需要一个事务，修改图标数据，然后建立库间关联
  const t = yield seq.transaction(transaction => {
    const iconInfo = icons.map(icon => {
      const data = {
        name: icon.name,
        tags: icon.tags,
        fontClass: icon.fontClass,
        status: iconStatus.PENDING,
        applyTime: new Date,
      };

      return Icon.update(
        data,
        { where: { id: icon.id }, transaction }
      );
    });

    return Promise
      .all(iconInfo)
      .then(() => {
        const iconData = icons.map(i => ({
          version: '0.0.0',
          iconId: i.id,
          repositoryId: repoId,
        }));
        return RepoVersion.bulkCreate(iconData, { transaction });
      })
      .then(() => {
        // 配置项目 log
        const log = {
          params: {
            icon: icons.map(i => ({ id: i.id, name: i.name })),
          },
          type: 'UPLOAD',
          loggerId: repoId,
          subscribers: [repo.admin],
        };
        return logRecorder(log, transaction, userId);
      });
  });
  yield t;

  this.state.respond = '图标提交成功';

  yield next;
}

export function* getIconInfo(next) {
  const { iconId } = this.param;
  invariant(!isNaN(iconId), '不支持传入空参数');

  const data = yield Icon.findOne({
    where: { id: iconId },
    include: [{
      model: Repo,
      through: {
        model: RepoVersion,
        version: '0.0.0',
      },
    }, User],
  });
  const icon = data.get({ plain: true });
  if (icon.repositories && icon.repositories.length) {
    icon.repo = icon.repositories[0];
    delete icon.repo.repoVersion;
    delete icon.repositories;
  }
  this.state.respond = icon;

  yield next;
}

export function* deleteIcons(next) {
  const { iconId } = this.param;
  const { userId } = this.state.user;

  invariant(!isNaN(iconId), `传入的 id 不合法，期望是数字，传入的却是 ${iconId}`);
  const iconInfo = yield Icon.findOne({
    attributes: ['status', 'uploader'],
    where: { id: iconId },
  });

  invariant(iconInfo, '未获取图标信息');
  invariant(
    userId === iconInfo.uploader,
    '没有权限删除他人上传的图标'
  );
  invariant(
    iconInfo.status === iconStatus.REJECTED ||
    iconInfo.status === iconStatus.UPLOADED,
    '只能删除审核未通过的图标或未上传的图标'
  );
  yield Icon.update(
    { status: iconStatus.DELETE },
    { where: { id: iconId } },
  );

  this.state.respond = '删除图标成功';
  yield next;
}

export function* updateIconInfo(next) {
  const { iconId, tags, name } = this.param;
  const { userId } = this.state.user;

  invariant(!isNaN(iconId), `传入的 id 不合法，期望是数字，传入的却是 ${iconId}`);
  const iconInfo = yield Icon.findOne({
    where: { id: iconId },
    include: [
      {
        model: Repo,
        through: {
          model: RepoVersion,
          where: { iconId },
        },
      },
    ],
  });
  const data = {};
  const errorMsg = [];

  if (typeof tags === 'string' && tags !== '') {
    data.tags = tags;
  } else {
    errorMsg.push(`期望传入的 tags 是非空字符串，传入的却是 ${tags}`);
  }

  // 大库管理员可以修改icon的name
  if (!iconInfo.repositories[0] || iconInfo.repositories[0].admin === userId) {
    errorMsg.push('用户不是大库管理员，无法修改图标名称');
  } else if (typeof name !== 'string' || name === '') {
    errorMsg.push(`期望传入的 name 是非空字符串，传入的却是 ${name}`);
  } else {
    data.name = name;
  }
  const msgStr = errorMsg.join('；');

  invariant(!isPlainObject(data), msgStr || '必须传入非空的数据参数');
  yield Icon.update(data, { where: { id: iconId } });

  this.state.respond = yield Icon.findOne({
    where: { id: iconId },
    attributes: ['name', 'tags'],
  });

  yield next;
}

// 这个是获取已经上传的，但是还没有提交的图标
export function* getUploadedIcons(next) {
  const { userId } = this.state.user;

  this.state.respond = yield Icon.findAll({
    where: { uploader: userId, status: iconStatus.UPLOADED },
  });
  yield next;
}

// 这个是获取已经提交的、上传的、被拒绝的图标，也就是上传历史
export function* getSubmittedIcons(next) {
  const { userId } = this.state.user;
  const { pageMixin } = this.state;
  const statusIn = {
    status: { $in: [
      iconStatus.RESOLVED,
      iconStatus.UPLOADED,
      iconStatus.REJECTED,
      iconStatus.PENDING,
    ] },
  };

  const timeGroup = yield Icon.findAll({
    attributes: ['createTime'],
    where: {
      uploader: userId,
      ...statusIn,
    },
    order: 'createTime DESC',
    group: 'createTime',
    ...pageMixin,
    raw: true,
  });
  const len = timeGroup.length;
  if (len) {
    const icons = yield Icon.findAll({
      where: {
        uploader: userId,
        createTime: {
          $lte: timeGroup[0].createTime,
          $gte: timeGroup[len - 1].createTime,
        },
        ...statusIn,
      },
      order: 'createTime DESC',
      raw: true,
    });
    const result = [];
    const _tmp = { createTime: '', icons: [] };
    icons.forEach(v => {
      if (_tmp.createTime
        && _tmp.createTime.toString() !== v.createTime.toString()) {
        result.push(Object.assign({}, _tmp)); // 只有一条数据时不会push进result；多条数据的最后一条数据也不会
        _tmp.icons = [];
      }
      _tmp.createTime = v.createTime;
      _tmp.icons.push(v);
    });
    result.push(Object.assign({}, _tmp));
    this.state.respond = result;
    const total = yield Icon.count({
      where: { uploader: userId, ...statusIn },
      group: 'createTime',
    });
    this.state.page.totalCount = total.length;
  } else {
    this.state.respond = [];
  }
  yield next;
}
