import { Icon } from '../../model';

export function* getById(next) {
  const { icons } = this.param;

  this.state.respond = yield Icon.findAll({
    attributes: ['id', 'name', 'path', 'oldId', 'newId'],
    where: { id: { $in: icons } },
  });

  yield next;
}

export function* getByCondition(next) {
  const { iconId } = this.param;
  let { q } = this.param;
  q = ['%', decodeURI(q), '%'].join('');
  const where = iconId ? {
    where: { id: iconId },
  } : {
    where: {
      $or: {
        name: { $like: q },
        tags: { $like: q },
      },
    },
  };
  this.state.respond = yield Icon.findAll(where);

  yield next;
}
