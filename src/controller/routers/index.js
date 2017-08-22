import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import general from './general';
import user from './user';
import owner from './owner';
import admin from './admin';
import config from '../../config';
import fs from 'fs';
import path from 'path';
import { downloadFontForThirdParty } from '../modules/common';
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
const down = new Router();

function* errorHandle(next) {
  try {
    yield next;
  } catch (e) {
    this.body = {
      res: false,
      status: e.status || 500,
      message: e.message || '服务器错误',
    };
  }
}
down.use(errorHandle);
// 下载比较特殊，单独写吧
down.get('/download/:filename', function* f() {
  const { caches } = config.path;
  const { filename } = this.params;
  const reg = /\.(\w+)$/;
  const type = filename.match(reg) ? filename.match(reg)[1] : null;
  const contentTypeMap = {
    zip: 'application/zip',
    png: 'image/png',
    svg: 'image/svg+xml',
  };
  const pos = type === 'zip' ? 'font' : type;

  if (type || Object.keys(contentTypeMap).indexOf(type) === -1) {
    const downloadPath = path.join(caches, config.path[pos], filename);
    this.set('Content-disposition', `attachment; filename=${filename}`);
    this.set('Content-type', contentTypeMap[type]);
    this.body = fs.createReadStream(downloadPath);
  } else {
    this.status = 500;
    this.body = `无法找到对应下载的文件：${filename}`;
  }
});

// 下载指定版本指定类型的字体文件
down.get('/download/name/:name/type/:type/version/:version', downloadFontForThirdParty);

router.use(bodyParser());
router.use(mergeParams);
router.use(responder);

router.use('/user', user.routes());
router.use('/owner', owner.routes());
router.use('/admin', admin.routes());
router.use(general.routes());

router.use();

export default router;
export { down };
