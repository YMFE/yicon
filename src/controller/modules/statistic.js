// import invariant from 'invariant';
import { iconStatus, totalIcons } from '../../constants/utils';

import { Icon } from '../../model';

export function* statistic(next) {
  const data = yield Icon.findAndCountAll({
    attributes: ['id', 'name', 'code', 'path'],
    where: { status: { $in: [iconStatus.DISABLED, iconStatus.RESOLVED] } },
    order: 'code asc',
  });
  data.total = totalIcons;
  this.state.respond = data;
  yield next;
}
