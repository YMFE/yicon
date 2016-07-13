import { Repo, Icon, User } from '../../model';
import { iconStatus } from '../../constants/utils';

// 为了提高查询效率，我们设置默认版本为 0.0.0
function* getRepoByVersion({ repoId, version = '0.0.0', limit }) {
  const repo = yield Repo.findOne({
    where: { id: repoId },
    include: [{
      model: Icon,
      attributes: ['id', 'name', 'code', 'path'],
      where: { status: iconStatus.RESOLVED },
      on: { version },
    }, User],
  });

  const rawRepo = repo.get({ plain: true });

  rawRepo.iconCount = rawRepo.icons.length;
  // TODO: hard-code，但是 dao 似乎没有更好的解决方案
  if (limit > 0 && rawRepo.icons.length > limit) {
    rawRepo.icons.length = limit;
  }

  return rawRepo;
}


export function* list(next) {
  const repoList = yield Repo.findAll({
    attributes: ['id'],
  });

  const len = repoList.length;
  const result = [];

  for (let i = 0; i < len; i++) {
    const repo = yield getRepoByVersion({
      repoId: repoList[i].id, limit: 44,
    });
    result.push(repo);
  }

  this.state.respond = result;

  yield next;
}

export function* getOne(next) {
  const { repoId, version } = this.param;

  this.state.respond = yield getRepoByVersion({
    repoId, version,
  });

  yield next;
}
