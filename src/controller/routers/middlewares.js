import { Project } from '../../model';
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
      message: e.message || '服务器错误',
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

export function* getCurrentUser(next) {
  this.state.user = {
    userId: 22,
  };
  const { projectId } = this.param;
  const project = yield Project.findOne({ where: { id: projectId } });
  if (project && !project.dataValues.public) {
    const members = yield project.getUsers();
    const isBelongToMembers = members.some(
      (value) => value.dataValues.id === this.state.user.userId
    );
    if (!isBelongToMembers) throw new Error('没有权限');
  }
  yield next;
}
