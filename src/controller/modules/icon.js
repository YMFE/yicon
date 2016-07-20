import { Icon, Repo, RepoVersion } from '../../model';
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

export function* getUploadedIcons(next) {
  const { userId } = this.state.user;
  const { pageMixin } = this.state;
  const timeGroup = yield Icon.findAll({
    attributes: ['applyTime'],
    where: { uploader: userId },
    order: 'applyTime DESC',
    group: 'applyTime',
    ...pageMixin,
    raw: true,
  });
  const len = timeGroup.length;
  if (len) {
    const icons = yield Icon.findAll({
      where: {
        uploader: userId,
        applyTime: {
          $lte: timeGroup[0].applyTime,
          $gte: timeGroup[len - 1].applyTime,
        },
      },
      order: 'applyTime DESC',
      raw: true,
    });
    const result = [];
    const _tmp = { applyTime: '', icons: [] };
    icons.forEach(v => {
      if (_tmp.applyTime && _tmp.applyTime.toString() !== v.applyTime.toString()) {
        result.push(Object.assign({}, _tmp)); // 只有一条数据时不会push进result；多条数据的最后一条数据也不会
        _tmp.icons = [];
      }
      _tmp.applyTime = v.applyTime;
      _tmp.icons.push(v);
    });
    result.push(Object.assign({}, _tmp));
    this.state.respond = result;
    const total = yield Icon.count({
      where: { uploader: userId },
      group: 'applyTime',
    });
    this.state.page.totalCount = total.length;
  } else {
    this.state.respond = '没有上传过图标';
  }
  yield next;
}
