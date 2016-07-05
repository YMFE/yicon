import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import general from './general';
import user from './user';
import owner from './owner';
import admin from './admin';

/**
 * 这里进行区分
 * api 接口统一添加 api 前缀
 * 大家都可以访问的，什么都不加
 * 普通用户才能访问的，加 '/user' 前缀
 * 库管用户可以访问的，加 '/owner' 前缀
 * 超管用户可以访问的，加 '/admin' 前缀
 */
const router = new Router({ prefix: '/api' });

router.use(bodyParser());

router.use(function* mergeParams(next) {
  this.param = {
    ...this.query,
    ...this.params,
    ...this.request.body,
  };
  this.state.page = {};

  if (!isNaN(+this.param.currentPage)) {
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
  }
  yield next;
});

router.use('/user', user.routes());
router.use('/owner', owner.routes());
router.use('/admin', admin.routes());
router.use(general.routes());

router.use(function* respondMiddleware(next) {
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
});

export default router;
