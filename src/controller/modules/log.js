import { Repo } from '../../model';

export function* getRepoLogs(next) {
  const { repoId } = this.param;

  const repo = yield Repo.findOne({ where: { id: repoId } });
  this.state.respond = yield repo.getLogs();
  yield next;
}
