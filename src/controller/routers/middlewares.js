import PrettyError from 'pretty-error';
import logger from '../../logger';
import invariant from 'invariant';
import { User, Repo, Project } from '../../model';

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('koa');

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
    const error = __DEVELOPMENT__ ? pe.render(e) : e;
    // 错误区分，如果是 invariant 认为是手动捕获的错误，无需记录日志
    if (error.name !== 'Invariant Violation') {
      logger.error(error);
    }
  }
}

export function* pagination(next) {
  invariant(
    this.param.currentPage > 0,
    `分页接口期望传入 currentPage，类型为数字，您传入的是 ${this.param.currentPage}`
  );

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
    // userId: 541,
  };
  const user = yield User.findOne({
    where: { id: this.state.user.userId },
  });

  invariant(user, '获取用户信息失败，请重新登录');
  this.state.user.model = user;

  yield next;
}

export function* isProjectMember(next) {
  const { projectId } = this.param;
  const user = this.state.user.model;

  if (!isNaN(projectId)) {
    const project = yield Project.findOne({
      where: { id: projectId },
    });
    invariant(project, `id 为 ${projectId} 的项目不存在`);
    const hasUser = yield project.hasUser(user);
    if (!hasUser && user.actor < 2) {
      invariant(false, '当前用户不是该项目的项目成员');
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
  invariant(repoOwner, '非大库管理员，没有权限');
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
  invariant(admin, '非超管，没有权限');
  yield next;
}
