import { User, Project } from '../../model';

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
    this.body = {
      ret: false,
      status: e.status || 500,
      message: e.stack || '服务器错误',
    };
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
  // TODO: 改为从 session 获取
  this.state.user = {
    userId: 2,
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
    if (!hasUser) {
      throw new Error('当前用户不是该项目的项目成员');
    }
  }

  yield next;
}

export function* isProjectOwner(next) {
  const { projectId } = this.param;
  this.state.user.isOwner = false;
  if (projectId) {
    const ownerId = yield Project.findOne({
      attributes: ['owner'],
      where: { id: projectId },
    });
    this.state.user.isOwner = this.state.user.userId === ownerId.owner;
    this.state.user.ownerId = ownerId.owner;
  }
  yield next;
}
