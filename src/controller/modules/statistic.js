// import invariant from 'invariant';
import { iconStatus, startCode, endCode } from '../../constants/utils';

import { Icon, Repo } from '../../model';

export function* statistic(next) {
  let { number, size } = this.param;
  const count = yield Icon.count({
    where: {
      status: { $in: [iconStatus.DISABLED, iconStatus.RESOLVED] },
    },
  });
  number = !isNaN(number) ? number : 1;
  size = !isNaN(size) ? size : 480;
  const icons = yield Icon.findAndCountAll({
    where: {
      code: { $lt: startCode + number * size },
      status: { $in: [iconStatus.DISABLED, iconStatus.RESOLVED] },
    },
    include: [{ model: Repo }],
    order: 'code asc',
  });

  const length = number * size < 6400 ? number * size : 6400;
  const data = [];
  const list = [];
  for (let i = 0; i < length; i++) {
    if (i % 16 === 0) {
      const num = startCode + i;
      list.push(num.toString(16).toUpperCase());
    }
    data.push({});
  }

  icons.rows.forEach(icon => {
    const { code } = icon;
    const index = code - parseInt(startCode, 10);
    data[index] = icon;
  });

  // 统计跳过的编码
  // let totalSkiped = 0;
  // const oldMaxCode = yield Icon.max('code');
  // const newMaxCode = yield Icon.max('code', {
  //   where: { code: { lt: 0xF000 } },
  // });
  // for (let i = 0; i <= oldMaxCode - startCode; i++) {
  //   if (!data[i].code) {
  //     ++totalSkiped;
  //   }
  // }

  const result = {};
  result.data = data;
  // result.skiped = 0; // totalSkiped - (0xF000 - newMaxCode);

  result.list = list;
  result.count = count;
  result.total = endCode - startCode + 1;
  this.state.respond = result;
  yield next;
}
