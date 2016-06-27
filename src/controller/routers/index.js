import Router from 'koa-router';
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

router.use(function* respond(next) {
  try {
    yield next;
    this.body = {
      res: true,
      data: this.state.respond,
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

router.use('/user', user.routes());
router.use('/owner', owner.routes());
router.use('/admin', admin.routes());
router.use(general.routes());

export default router;
