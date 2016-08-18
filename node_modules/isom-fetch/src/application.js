import process from 'process';
import invariant from 'invariant';
import { getRequest, getResponse } from './mask';

/**
 * 创造一个假的中间件执行环境
 *
 * @param option {Object} 请求参数
 * @param defaults {Object} 默认请求参数
 * @returns {Object} 执行环境，即中间件的 this
 */
export function createContext(option, defaults) {
  const context = Object.create(this);
  const request = context.request = Object.create(this.request);
  const response = context.response = Object.create(this.response);

  context.app = request.app = response.app = this.app;
  context.req = request.req = response.req = getRequest(defaults, option);
  context.res = request.res = response.res = getResponse();
  request.ctx = response.ctx = context;
  request.response = response;
  response.request = request;
  // 配合 bodyParser，将数据绑到 body 上
  context.request.body = context.req.body;

  context.onerror = context.onerror.bind(context);
  context.originalUrl = request.originalUrl = context.req.url;

  context.state = {};
  return context;
}

/**
 * 处理 respond，不使用 res.send 而是直接返回 body 的值
 *
 * @returns {*} 返回 body 的值
 */
export function respond() {
  if (this.method === 'HEAD') {
    return null;
  }

  return this.body || null;
}

/**
 * 服务端方法装饰器，在浏览器环境下使用时抛出异常
 *
 * @param target
 * @param name
 * @param descriptor
 * @returns {*}
 */
export function serverSideMethod(target, name, descriptor) {
  const desc = descriptor;
  const method = desc.value;

  desc.value = function des(...args) {
    invariant(!process.browser, `method 'fetch#${name}' cannot work in browser`);
    return method.apply(this, args);
  };

  return desc;
}
