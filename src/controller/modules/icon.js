import fontBuilder from 'iconfont-builder';
import invariant from 'invariant';
// import py from 'pinyin';

import { seq, Icon, RepoVersion } from '../../model';
import { isPlainObject } from '../../helpers/utils';
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

  // 这里需要一个事务，修改图标数据，然后建立库间关联
  const transaction = yield seq.transaction(t => {
    const iconInfo = icons.map(icon => {
      const data = {
        name: icon.name,
        tags: icon.tags,
        fontClass: icon.style,
        status: iconStatus.PENDING,
      };

      return Icon.update(data, {
        where: { id: icon.id },
      }, { transaction: t });
    });

    return Promise
      .all(iconInfo)
      .then(() => {
        const iconData = icons.map(i => ({
          version: '0.0.0',
          iconId: i.id,
          repositoryId: repoId,
        }));
        return RepoVersion.bulkCreate(iconData, { transaction: t });
      });
  });
  yield transaction;

  this.state.respond = '图标提交成功';

  yield next;
}
