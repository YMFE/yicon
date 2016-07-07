import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import general from './general';
import user from './user';
import owner from './owner';
import admin from './admin';
import { mergeParams, responder } from './middlewares';

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
router.use(mergeParams);
router.use(responder);

router.use('/user', user.routes());
router.use('/owner', owner.routes());
router.use('/admin', admin.routes());
router.use(general.routes());

router.use();

export default router;
