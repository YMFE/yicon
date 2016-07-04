import { Repo, Icon, User, RepoVersion } from '../../model';
import { versionTools } from '../../helpers/utils';

function* getRepoByVersion({ repoId, version, limit }) {
  const getVersion = version
    ? Promise.resolve(versionTools.v2n(version))
    : RepoVersion.max('version', { where: { repositoryId: repoId } });

  const finalVersion = yield getVersion;
  let replacedIcons = yield Icon.findAll({
    attributes: ['oldId'],
    include: [{
      model: Repo,
      where: { id: repoId },
      on: { version: { $lte: finalVersion } },
    }],
  });

  replacedIcons = replacedIcons
    .filter(i => i.oldId)
    .map(i => i.oldId);

  const whereClause = {
    status: { $gte: 20 },
  };
  if (replacedIcons.length) {
    whereClause.id = { $notIn: replacedIcons };
  }

  const repo = yield Repo.findOne({
    where: { id: repoId },
    include: [{
      model: Icon,
      where: whereClause,
      on: { version: { $lte: finalVersion } },
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

  // 这里统一不写在 this.body，最后一个中间件再挂，需要制定一下 this.state 的书写规范
  this.state.respond = yield getRepoByVersion({
    repoId, version,
  });

  yield next;
}
