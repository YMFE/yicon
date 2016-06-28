import { Icon } from '../../model';

export function* getById(next) {
  const { icons } = this.param;

  this.state.respond = yield Icon.findAll({
    attributes: ['id', 'name', 'path'],
    where: { id: { $in: icons } },
  });

  yield next;
}
