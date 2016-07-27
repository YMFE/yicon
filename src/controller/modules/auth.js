import axios from 'axios';
import { User } from '../../model';

function* verifyToken(token) {
  const verifyTokenURL = `http://qsso.corp.qunar.com/api/verifytoken.php?token=${token}`;
  return yield axios.get(verifyTokenURL)
    .then(value => value.data)
    .catch(err => {
      throw new Error(err);
    });
}

function* insertToDB(data) {
  const { userId } = data;
  const info = yield User.findOrCreate({
    where: { name: userId },
    defaults: {
      name: userId,
      actor: 0,
    },
  });
  return info;
}

export function* getUserInfo(next) {
  const { token } = this.param;
  const verifyResult = yield verifyToken(token);
  if (verifyResult.ret) {
    const info = yield insertToDB(verifyResult.data);
    this.session.name = encodeURIComponent(verifyResult.data.userInfo.name);
    this.session.userId = info[0].id;
    this.session.domain = info[0].name;
    this.session.actor = info[0].actor;
    this.redirect('/');
  } else {
    throw new Error(verifyResult.errmsg);
  }
  yield next;
}

export function* isLogin(next) {
  const session = this.session;
  if (!session || !session.userId) throw new Error('尚未登录');
  yield next;
}

export function* clearUserInfo(next) {
  this.session = null;
  this.redirect('/');
  yield next;
}

export function* validateAuth(next) {
  const { type } = this.param;
  const { userId } = this.session;
  switch (type) {
    case 'owner': {
      const user = yield User.findOne({ where: { id: userId } });
      if (!user || user.actor < 1) throw new Error('no-auth');
      yield next;
      return;
    }
    case 'admin': {
      const user = yield User.findOne({ where: { id: userId } });
      if (!user || user.actor < 2) throw new Error('no-auth');
      yield next;
      return;
    }
    default:
      if (!userId) throw new Error('no-login');
      yield next;
      return;
  }
}
