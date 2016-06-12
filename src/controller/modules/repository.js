import { Repo, Icon, RepoVersion } from '../../model';
import { versionTools } from '../../helpers/utils';

function* getRepoByVersion({ repoId, version, limit = null }) {
  const getVersion = version
    ? Promise.resolve(versionTools.v2n(version))
    : RepoVersion.max('version', { where: { repositoryId: repoId } });

  const finalVersion = yield getVersion;
  let replacedIcons = yield Icon.findAll({
    attributes: ['replaceId'],
    include: [{
      model: Repo,
      where: { id: repoId },
      on: { version: { $lte: finalVersion } },
    }],
  });

  replacedIcons = replacedIcons
    .filter(i => i.replaceId)
    .map(i => i.replaceId);

  return yield Repo.findOne({
    where: { id: repoId },
    include: [{
      model: Icon,
      where: {
        status: { $gte: 20 },
        id: { $notIn: replacedIcons },
      },
      on: { version: { $lte: finalVersion } },
      limit,
    }],
  });
}


export function* list(next) {
  const repoList = yield Repo.findAll({
    attributes: ['id'],
  });
  const len = repoList;
  const result = [];

  for (let i = 0; i < len; i++) {
    const repo = yield getRepoByVersion({
      repoId: repoList[i], limit: 44,
    });
    result.push(repo);
  }

  this.state.respond = result;

  yield next;
}

export function* getOne(next) {
  const { repoId, version } = this.params;

  // 这里统一不写在 this.body，最后一个中间件再挂，需要制定一下 this.state 的书写规范
  this.state.respond = yield getRepoByVersion({
    repoId, version,
  });

  yield next;
}
