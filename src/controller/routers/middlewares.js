import { UserProject } from '../../model';
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
    userId: 2,
  };
  const { projectId } = this.param;

  if (projectId) {
    const isBelongToMembers = yield UserProject.findOne({
      where: {
        userId: this.state.user.userId,
        projectId,
      },
    });
    if (!isBelongToMembers) throw new Error('没有权限');
  }

  yield next;
}
