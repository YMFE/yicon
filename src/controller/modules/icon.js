import { Icon } from '../../model';
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
