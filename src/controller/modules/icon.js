import fontBuilder from 'iconfont-builder';
// import py from 'pinyin';

import { Icon, Repo } from '../../model';
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
  console.log('files', this.req.files);
  // 处理传入文件
  const param = {
    icons: this.req.files.map(file => ({
      // TODO: 截取图标文件名层，不要 svg 后缀
      name: file.originalname,
      buffer: file.buffer,
    })),
    writeFiles: false,
  };
  console.log('param', param);
  const icons = yield fontBuilder(param);
  const user = this.state.user.model;
  yield user.createIcon(icons.map(icon => ({
    name: icon.name,
    path: icon.d,
    status: iconStatus.UPLOADED,
  })));

  // TODO: 看一下上传失败是否会直接抛出异常
  this.state.respond = '图标上传成功';

  yield next;
}

export function* submitIcons(next) {
  const { repoId, icons } = this.param;
  const iconInfo = icons.map(icon => {
    const data = {
      name: icon.name,
      tags: icon.tags,
      fontClass: icon.style,
      status: iconStatus.PENDING,
    };
    return Icon.update(data, { where: { id: icon.id } });
  });

  const repo = yield Repo.findOne({ where: { id: repoId } });
  const updatedIcons = yield Promise.all(iconInfo);
  yield repo.addIcons(updatedIcons);
  yield next;
}
