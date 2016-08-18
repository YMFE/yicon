import process from 'process';
import axios from 'axios';
import co from 'co';
import invariant from 'invariant';
import 'es6-promise';

import { getURL } from './mask';
import compose from './compose';
import reduxIsomFetch from './middleware';
import { getUrlState as getURLStateName } from './defaults';

import {
  createContext,
  respond,
  serverSideMethod,
} from './application';

const isBrowser = process.browser;

/**
 * 在服务端环境下，fetch 需要保持单例模式
 * 由于 react 渲染是同步的，因此在一次 SSR 过程中是正确的
 */
let singleton = null;

class Fetch {

  constructor(options = {}) {
    this.options = options;
    this.thunk = !!options.thunk;
    this.axios = axios.create(options);
  }

  @fetchDecorator
  request() {}

  @fetchDecorator
  get() {}

  @fetchDecorator
  post() {}

  @fetchDecorator
  patch() {}

  @fetchDecorator
  delete() {}

  @fetchDecorator
  head() {}

  @fetchDecorator
  put() {}

  /**
   * 在服务器环境下生成一个单例的 fetch
   *
   * @param ctx {Object} koa 的 app 实例
   * @param router {Router} koa-router 对象
   * @return {Fetch} 返回一个 fetch 的单例对象
   */
  @serverSideMethod
  use(ctx, router) {
    // TODO: 对 ctx 实例进行简单的校验吧
    this.ctx = ctx;
    this.router = router;
    this.fetchCollection = [];
    this.urlCollection = {};
    return this;
  }

  /**
   * 使用后端中间件充当请求体，并记录返回的 promise
   *
   * @param options {Object} 请求内容
   * @param defaults {Object}  默认配置请求参数
   * @return {Promise} 返回一个 promise，请求的返回值
   */
  @serverSideMethod
  dispatch(options, defaults) {
    const context = createContext.call(this.ctx, options, defaults);
    const fn = co.wrap(compose([this.router.routes()]));
    const promise = fn.call(context).then(() => respond.call(context));
    this.fetchCollection.push(promise);

    // 记录已渲染的 url
    if (typeof this.urlCollection[context.req.url] === 'number') {
      this.urlCollection[context.req.url]++;
    } else {
      this.urlCollection[context.req.url] = 1;
    }
    return promise;
  }

  /**
   * 执行完所有请求的处理结果
   *
   * @param [callback] {Function} 回调函数
   * @returns {Promise} 返回所有请求执行完成的情况
   */
  @serverSideMethod
  all(callback) {
    const promise = Promise.all(singleton.fetchCollection);
    singleton = null;

    return typeof callback === 'function'
      ? promise.then(callback)
      : promise;
  }
}

/**
 * 装饰器方法，统一处理所有 method 请求别名
 *
 * @param target
 * @param name
 * @param descriptor
 * @returns {Promise}
 */
function fetchDecorator(target, name, descriptor) {
  const desc = descriptor;
  desc.value = function des(...args) {
    let result;

    switch (name) {
      case 'request':
        result = args[0];
        break;
      case 'get':
      case 'delete':
      case 'head': {
        const [url, config = {}] = args;
        config.url = url;
        config.method = name.toUpperCase();
        result = config;
        break;
      }
      default: {
        const [url, data = {}, config = {}] = args;
        config.url = url;
        config.method = name.toUpperCase();
        config.data = { ...config.data, ...data };
        result = config;
        break;
      }
    }

    if (isBrowser) {
      if (this.thunk) {
        const payload = (dispatch, action) => {
          this.axios.request(result).then(resp => dispatch({
            type: action.type,
            payload: resp.data,
          }));
        };
        payload.isomFetch = true;
        payload.url = getURL({ ...this.options, ...result });
        return payload;
      }
      return this.axios.request(result).then(resp => resp.data);
    }

    // 在没有单例的时候直接解决一下
    if (!singleton) return Promise.resolve();
    // 在服务端需要使用单例的 dispatch
    return singleton.dispatch(result, this.options);
  };
  return desc;
}

export default {

  /**
   * 在服务器环境下生成一个单例的 fetch
   *
   * @param ctx {Object} koa 的 app 实例
   * @param router {Router} koa-router 对象
   * @return {Fetch} 返回一个 fetch 的单例对象
   */
  use(ctx, router) {
    singleton = new Fetch();
    singleton.use(ctx, router);
    return singleton;
  },

  /**
   * 返回新的 fetch 实例
   *
   * @param options {Object} 配置属性
   * @return {Fetch} 新的 fetch 实例
   */
  create(options) {
    return new Fetch(options);
  },

};

export { reduxIsomFetch, getURLStateName };
