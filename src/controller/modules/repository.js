import { Repo, Icon, RepoVersion } from '../../model';
import { versionTools } from '../../helpers/utils';

export const list = () => {};

export function* getOne(next) {
  const { repoId, version } = this.params;
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

  // 这里统一不写在 this.body，最后一个中间件再挂，需要制定一下 this.status 的书写规范
  this.body = yield Repo.findOne({
    where: { id: repoId },
    include: [{
      model: Icon,
      where: {
        status: { $gte: 20 },
        id: { $notIn: replacedIcons },
      },
      on: { version: { $lte: finalVersion } },
    }],
  });

  yield next;
}
