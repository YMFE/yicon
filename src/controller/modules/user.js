import { User } from '../../model';

export function* getUserByName() {
  const { username } = this.param;
  this.state.respond = yield User.findOne({
    where: { name: username },
  });
}
