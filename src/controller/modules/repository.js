import { Repo, Icon, User } from '../../model';
import { iconStatus } from '../../constants/utils';

// 为了提高查询效率，我们设置默认版本为 0.0.0
function getRepoByVersion({ repoId, version = '0.0.0', limit }) {
  return Repo.findOne({
    where: { id: repoId },
    include: [{
      model: Icon,
      attributes: ['id', 'name', 'code', 'path'],
      where: { status: iconStatus.RESOLVED },
      on: { version },
    }, User],
  })
  .then(repo => {
    if (!repo) throw new Error(`id 为 ${repoId} 的大库不存在`);
    return repo.get({ plain: true });
  })
  .then(res => {
    const repo = res;
    repo.iconCount = repo.icons.length;
    if (limit && limit < repo.icons.length) {
      repo.icons.length = limit;
    }
    return repo;
  })
  .catch(e => { throw new Error(e); });
}

export function* list(next) {
  const repoList = yield Repo.findAll({
    attributes: ['id'],
  });

  const queue = repoList.map(repo => getRepoByVersion({
    repoId: repo.id, limit: 15,
  }));

  this.state.respond = yield Promise.all(queue);

  yield next;
}

export function* getOne(next) {
  const { repoId, version } = this.param;

  this.state.respond = yield getRepoByVersion({
    repoId, version,
  });

  yield next;
}

export function* updateRepoNotice(next) {
  const { repoId, notice } = this.param;
  let repoResult = 0;
  if (notice !== undefined) repoResult = yield Repo.update({ notice }, { where: { id: repoId } });
  if (repoResult) {
    this.state.respond = '大库通知更新成功';
  } else {
    this.state.respond = '大库通知更新失败';
  }
  yield next;
}

export function* updateRepoOwner(next) {
  const { repoId, admin } = this.param;
  let repoResult = 0;
  if (admin !== undefined) repoResult = yield Repo.update({ admin }, { where: { id: repoId } });
  if (repoResult) {
    this.state.respond = '大库所有者更改成功';
  } else {
    this.state.respond = '大库所有者更改失败';
  }
  yield next;
}
