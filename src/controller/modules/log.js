import { User, Repo, Log, Project } from '../../model';


function* getLog(id, model, scope, pageMixin) {
  const data = yield model.findOne({ where: { id } });
  const logs = yield data.getLogs({
    attributes: { exclude: ['operator'] },
    include: [
      { model, as: scope },
      { model: User, as: 'logCreator' },
    ],
    ...pageMixin,
  });
  const totalCount = yield Log.count({
    where: {
      loggerId: id,
      scope,
    },
  });
  return { logs, totalCount };
}

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

export function* getLogList(next) {
  const { repoId, projectId } = this.param;
  const { pageMixin } = this.state;
  let result = {};
  if (!isNaN(repoId)) {
    result = yield getLog(repoId, Repo, 'repo', pageMixin);
  } else if (!isNaN(projectId)) {
    result = yield getLog(projectId, Project, 'project', pageMixin);
  }

  this.state.respond = result.logs;
  this.state.page.totalCount = result.totalCount;
  yield next;
}
