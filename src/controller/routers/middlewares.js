import { User, Repo, Project } from '../../model';

export function* mergeParams(next) {
  this.param = {
    ...this.query,
    ...this.params,
    ...this.request.body,
  };

  yield next;
}

export function* responder(next) {
  try {
    yield next;
    const { respond, page } = this.state;
    const body = { data: respond, page };
    this.body = {
      res: true,
      ...body,
    };
  } catch (e) {
    // TODO: 记录错误日志
    this.body = {
      res: false,
      status: e.status || 500,
      message: e.message || '服务器错误',
    };
    console.log(`[Error] ${e.stack}`);
    // this.app.emit('error', e, this);
    return;
  }
}

export function* pagination(next) {
  if (isNaN(+this.param.currentPage)) {
    throw new Error('分页接口必须传入 currentPage 参数！');
  }

  this.param.currentPage = +this.param.currentPage;
  this.param.pageSize = +this.param.pageSize || 10;

  const { currentPage, pageSize } = this.param;
  this.state.page = {
    currentPage,
    pageSize,
    totalCount: 0,
  };
  this.state.pageMixin = {
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  };
  yield next;
}

// TODO: 将业务型的 middleware 移至对应的 controller 中
export function* getCurrentUser(next) {
  this.state.user = {
    userId: this.session.userId,
    // userId: 113,
  };
  const { projectId } = this.param;
  const user = yield User.findOne({
    where: { id: this.state.user.userId },
  });

  if (!user) throw new Error('获取用户信息失败，请重新登录');
  this.state.user.model = user;

  if (!isNaN(projectId)) {
    const project = yield Project.findOne({
      where: { id: projectId },
    });
    if (!project) throw new Error(`id 为 ${projectId} 的项目不存在`);
    const hasUser = yield project.hasUser(user);
    if (!hasUser && user.actor < 2) {
      throw new Error('当前用户不是该项目的项目成员');
    }
  }

  yield next;
}

export function* isProjectOwner(next) {
  const { projectId } = this.param;
  this.state.user.isProjectOwner = false;
  if (!isNaN(projectId)) {
    const project = yield Project.findOne({
      attributes: ['owner'],
      where: { id: projectId },
    });
    this.state.user.isProjectOwner =
      // 强制让超管什么都能干
      this.state.user.userId === project.owner || this.session.actor >= 2;
    this.state.user.ownerId = project.owner;
  }
  yield next;
}

export function* isRepoOwner(next) {
  const { repoId } = this.param;
  const { userId } = this.state.user;
  let repoOwner = false;
  if (!isNaN(repoId)) {
    const result = yield Repo.findOne({
      where: { id: repoId, admin: userId },
    });
    repoOwner = !!result;
  } else {
    const result = yield Repo.findAll({
      where: { admin: userId },
    });
    repoOwner = !!result.length;
    if (repoOwner) {
      this.state.user.repoList = result.map(r => r.id);
    }
  }
  // 强制让超管什么都能干
  repoOwner = repoOwner || this.session.actor >= 2;
  if (!repoOwner) throw new Error('非大库管理员，没有权限');
  yield next;
}

export function* isAdmin(next) {
  const { userId } = this.state.user;
  let admin = false;
  if (!isNaN(userId)) {
    const actor = yield User.findOne({
      attributes: ['actor'],
      where: { id: userId },
    });
    admin = actor.actor === 2;
  }
  if (!admin) throw new Error('非超管，没有权限');
  yield next;
}
