import { User, Repo, Log, Project } from '../../model';
import { Logger } from '../../helpers/utils';

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

/**
 * 记录日志中间件，需要分析 state.log
 * 同时确定日志（通知）的发送对象
 */
export function recordLog(type) {
  return function* recordLogByType(next) {
    const { params, loggerId } = this.state.log;
    const log = new Logger(type, params);
    const scope = /^PROJECT/.test(type) ? 'project' : 'repo';
    const logId = yield Log.create({
      type,
      loggerId,
      scope,
      operation: log.text,
    });
    console.log(logId);

    yield next;
  };
}
