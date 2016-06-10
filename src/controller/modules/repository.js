import { Repo, Icon, RepoVersion } from '../../model';
import { versionTools } from '../../helpers/utils';

export const list = () => {};

export function* getOne(next) {
  const { id, version } = this.param;
  const getVersion = version
    ? Promise.resolve(versionTools.v2n(version))
    : RepoVersion.max('version', { where: { repositoryId: id } });

  const finalVersion = yield getVersion;
  let replacedIcons = yield Icon.findAll({
    attributes: ['replaceId'],
    include: [{
      model: Repo,
      where: { id },
      on: { version: { $lte: finalVersion } },
    }],
  });

  replacedIcons = replacedIcons.map(i => i.replaceId);

  this.body = yield Repo.findOne({
    where: { id },
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
