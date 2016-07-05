import { User, Repo, Log } from '../../model';

export function* getRepoLogs(next) {
  const { repoId } = this.param;

  const repo = yield Repo.findOne({ where: { id: repoId } });
  this.state.respond = yield repo.getLogs({
    attributes: { exclude: ['operator'] },
    include: [
      { model: Repo, as: 'repo' },
      { model: User, as: 'logCreator' },
    ],
    ...this.state.pageMixin,
  });

  this.state.page.totalCount = yield Log.count({
    where: {
      loggerId: repo.id,
      scope: 'repo',
    },
  });
  yield next;
}
