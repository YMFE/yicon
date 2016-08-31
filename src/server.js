import Koa from 'koa';
import React from 'react';
import path from 'path';
import routes from './routes';
import ReactDOM from 'react-dom/server';
import compress from 'koa-compress';
import session from 'koa-session';
import serve from 'koa-static';
import favicon from 'koa-favicon';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import createStore from './reducer';
import Html from './helpers/Html';
// import { getPageTitle } from './helpers/utils';
import { router, down } from './controller';
import isomFetch from 'isom-fetch';
import logger from './logger';

const app = new Koa();
const { PORT } = process.env;

app.keys = [
  'WinterIsComing',
  'TheNorthRemember',
];
app.use(compress());
app.use(favicon(path.join(__dirname, '../static/favicon.ico')));
app.use(session({ key: 'yicon:sess' }, app));
app.use(serve(path.join(__dirname, '../static')));

app.use(router.routes());
app.use(down.routes());

function fetchServerData(props, { dispatch }) {
  return props.components.map(c => {
    if (!c) return null;
    const fetchHandler = c.fetchServerData ||
      (c.WrappedComponent && c.WrappedComponent.fetchServerData);
    if (typeof fetchHandler === 'function') {
      return fetchHandler(dispatch, props);
    }
    return null;
  }).filter(v => v);
}

const getRouteContext = (ctx, store) =>
  new Promise(resolve => {
    match({
      routes: routes(store),
      location: ctx.originalUrl,
    }, (error, redirect, renderProps) => {
      if (error) {
        ctx.status(500).send(error.message);
        resolve('NOT_MATCH');
      } else if (redirect) {
        ctx.redirect(redirect.pathname + redirect.search);
        resolve('NOT_MATCH');
      } else if (renderProps) {
        // 支持 material-ui 的 server-render
        global.navigator = {
          userAgent: ctx.req.headers['user-agent'],
        };

        // 使用 div 包裹是为了前端的 devTools 的渲染
        const component = (
          <Provider store={store} key="provider">
            <div>
              <RouterContext {...renderProps} />
              <div />
            </div>
          </Provider>
        );
        const sess = ctx.session;
        // 处理以下登录 reducer
        store.dispatch({
          type: 'FETCH_USER_INFO',
          payload: {
            userId: sess.userId,
            name: sess.domain,
            real: sess.name ? decodeURIComponent(sess.name) : undefined,
            login: !!sess.userId,
            repoAdmin: sess.repoAdmin,
            admin: sess.actor === 2,
          },
        });
        const def = fetchServerData.call(ctx, renderProps, store);

        const render = (fetchedURLs) => `<!DOCTYPE html>\n${
          ReactDOM.renderToString(
            <Html
              assets={webpackIsomorphicTools.assets()}
              component={component}
              store={store}
              urls={fetchedURLs}
              title="呵呵"
              authType="qsso"
            />
        )}`;

        if (def.length) {
          Promise
            .all(def)
            .then(() => resolve(render()))
            .catch(e => {
              ctx.status(500).send(e.message);
              resolve('NOT_MATCH');
            });
        } else {
          resolve(render());
        }
      } else {
        resolve('NOT_MATCH');
      }
    });
  });

app.use(function* s(next) {
  if (/^\/api/.test(this.url)) {
    yield next;
  } else {
    if (__DEVELOPMENT__) {
      webpackIsomorphicTools.refresh();
    }
    const store = createStore();
    isomFetch.use(this, router);
    const result = yield getRouteContext(this, store);
    if (result !== 'NOT_MATCH') {
      this.body = result;
    }
  }
});

app.listen(PORT, (err) => {
  if (err) {
    logger.error(err);
  } else {
    logger.info('==> 🐸  Server listening on port %s', PORT);
  }
});
