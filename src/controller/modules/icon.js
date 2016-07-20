import fontBuilder from 'iconfont-builder';
import invariant from 'invariant';
// import py from 'pinyin';

import { logRecorder } from './log';
import { seq, Repo, Icon, RepoVersion } from '../../model';
import { isPlainObject, unique } from '../../helpers/utils';
import { iconStatus } from '../../constants/utils';

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

  if (isPlainObject(this.query)) throw new Error('必须传入查询条件');
  if (q === '') throw new Error('不支持传入空参数');

  const query = `%${decodeURI(q)}%`;
  this.state.respond = yield Icon.findAll({
    where: {
      status: { $gte: iconStatus.RESOLVED },
      $or: {
        name: { $like: query },
        tags: { $like: query },
      },
    },
  });

  yield next;
}

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
    icons: this.req.files.map(file => ({
      // TODO: 截取图标文件名，不要 svg 后缀
      name: file.originalname,
      buffer: file.buffer,
    })),
    // 标记只返回图标信息数据
    writeFiles: false,
  };

  const icons = yield fontBuilder(param);
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

// 获取用户已上传图标
export function* getUploadIcons(next) {
  const user = this.state.user.model;
  const icons = yield user.getIcons({
    where: {
      status: iconStatus.UPLOADED,
    },
  });
  this.state.respond = icons;
  yield next;
}

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
        fontClass: icon.style,
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

// 获取审核列表
export function* getAuditList(next) {
  const { repoList } = this.state.user;

  const auditData = yield Promise.all(repoList.map(id =>
    Icon.findAll({
      where: { status: iconStatus.PENDING },
      through: {
        model: RepoVersion,
        where: { repositoryId: id },
      },
    })
  ));

  this.state.respond = auditData;
  yield next;
}

// 审核某图标入库
export function* auditIcons(next) {
  const { icons } = this.param;
  const { userId } = this.state.user;
  // 预处理，防止有不传 id 的情况
  icons.forEach(icon => {
    invariant(
      !isNaN(icon.id),
      `icons 数组期望传入合法 id，目前传入的是 ${icon.id}`
    );
    invariant(
      typeof icon.passed === 'boolean',
      `icon.passed 期望传入布尔值，目前传入的是 ${typeof icon.passed}`
    );
    invariant(
      !isNaN(icon.repoId),
      `icons 数组期望传入合法大库 id，目前传入的是 ${icon.repoId}`
    );
    invariant(
      !isNaN(icon.uploader),
      `icons 数组期望传入合法大库上传者，目前传入的是 ${icon.uploader}`
    );
  });

  const t = yield seq.transaction(transaction => {
    const iconInfo = icons.map(icon => {
      const data = {
        status: icon.passed ? iconStatus.RESOLVED : iconStatus.REJECTED,
      };
      return Icon.update(
        data,
        { where: { id: icon.id }, transaction }
      );
    });

    return Promise
      .all(iconInfo)
      .then(() => {
        const iconData = icons.reduce((p, n) => {
          const prev = p;
          if (Array.isArray(p[n.repoId])) {
            prev[n.repoId].push(n);
          } else {
            prev[n.repoId] = [n];
          }
          return p;
        }, {});
        const log = [];
        Object.keys(iconData).forEach(repoId => {
          const auditOk = iconData[repoId].filter(i => i.passed);
          const auditFailed = iconData[repoId].filter(i => !i.passed);
          log.push({
            params: {
              icon: auditOk.map(i => ({ id: i.id, name: i.name })),
            },
            type: 'AUDIT_OK',
            loggerId: repoId,
            subscribers: unique(auditOk.map(i => i.uploader)),
          });
          log.push({
            params: {
              icon: auditFailed.map(i => ({ id: i.id, name: i.name })),
            },
            type: 'AUDIT_FAILED',
            loggerId: repoId,
            subscribers: unique(auditFailed.map(i => i.uploader)),
          });
        });
        return logRecorder(log, transaction, userId);
      });
  });

  yield t;
  yield next;
}

export function* getIconInfo(next) {
  const { iconId } = this.param;
  if (isNaN(iconId)) throw new Error('不支持传入空参数');

  const iconInfo = yield Icon.findOne({ where: { id: iconId }, raw: true });
  const { repositoryId } = yield RepoVersion.findOne({ where: { iconId } });
  const repoInfo = yield Repo.findOne({
    attributes: ['id', 'name', 'alias'],
    where: { id: repositoryId },
    raw: true,
  });
  const result = { repository: repoInfo };
  Object.assign(result, iconInfo);
  this.state.respond = result;
  yield next;
}
