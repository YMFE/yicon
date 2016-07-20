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
