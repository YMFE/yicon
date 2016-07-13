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
