import { User } from '../../model';
export function* getAllInfo(next) {
  const { userId } = this.state.user;
  const user = yield User.findOne({ where: { id: userId } });
  const info = yield user.getInfo();
  const result = {
    id: userId,
    name: user.name,
    actor: user.actor,
    infoList: info,
  };
  this.state.respond = result;
  yield next;
}
