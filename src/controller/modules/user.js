import invariant from 'invariant';
import { User, Repo } from '../../model';

// suggest 获取用户名称
export function* getUserByName() {
  const { q } = this.param;
  this.state.respond = yield User.findAll({
    where: { name: { $like: `${q}%` } },
    limit: 6,
  });
}

// 获取 session 用户信息
export function* getUserSessionInfo(next) {
  const sess = this.session;
  // 处理以下登录 reducer
  this.state.respond = {
    userId: sess.userId,
    name: sess.domain,
    real: sess.name ? decodeURIComponent(sess.name) : undefined,
    login: !!sess.userId,
    repoAdmin: sess.repoAdmin,
    admin: sess.actor === 2,
  };
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
      // if (!user || user.actor < 1) throw new Error('no-auth');
      // 没有权限不算 Error，不应写入错误日志
      invariant(user && user.actor >= 1, 'no-auth');
      break;
    }
    case 'admin': {
      const user = yield User.findOne({ where: { id: userId } });
      // if (!user || user.actor < 2) throw new Error('no-auth');
      // 没有权限不算 Error，不应写入错误日志
      invariant(user && user.actor >= 2, 'no-auth');
      break;
    }
    default:
      // if (!userId) throw new Error('no-login');
      // 未登录不算 Error，不应写入错误日志
      invariant(userId, 'no-login');
      break;
  }
  this.state.respond = '校验成功';
  yield next;
  return;
}

// ========== 超管添加与删除  ========== //

export function* listAdmin(next) {
  const { userId } = this.session;
  const users = yield User.findAll({ where: { actor: 2 } });
  const usersAdjust = [];
  users.forEach((val) => {
    if (val.id === userId) {
      usersAdjust.unshift(val);
    } else {
      usersAdjust.push(val);
    }
    return usersAdjust;
  });
  this.state.respond = usersAdjust;
  yield next;
}

export function* addAdmin(next) {
  const { userId } = this.param;
  yield User.update({ actor: 2 }, { where: { id: userId } });
  this.state.respond = yield User.findAll({ where: { actor: 2 } });
  yield next;
}

export function* delAdmin(next) {
  const { userId } = this.param;
  const currentUser = this.state.user && this.state.user.userId;
  invariant(+userId !== +currentUser, '无法删除自身超管权限');
  const count = yield User.count({ where: { actor: 2 } });
  invariant(count > 1, '删除之后系统将没有超管，不可删除');
  const repoAdmins = yield Repo.findAll({
    where: { admin: userId },
  });
  const actor = repoAdmins && repoAdmins.length ? 1 : 0;
  yield User.update({ actor }, { where: { id: userId } });
  this.state.respond = yield User.findAll({ where: { actor: 2 } });
  yield next;
}
