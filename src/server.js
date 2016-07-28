import Koa from 'koa';
import React from 'react';
import path from 'path';
import debug from 'debug';
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
import { router, down } from './controller';
import isomFetch from 'isom-fetch';

const app = new Koa();
const { PORT } = process.env;
const store = createStore();

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

const getRouteContext = (ctx) =>
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

        const render = (fetchedURLs) => `<!DOCTYPE html>\n${
          ReactDOM.renderToString(
            <Html
              assets={webpackIsomorphicTools.assets()}
              component={component}
              store={store}
              urls={fetchedURLs}
              authType="qsso"
            />
        )}`;

        resolve(render());
        // render();
        // fetch.all(() => resolve(render(fetch.urlCollection)));
      } else {
        resolve('NOT_MATCH');
      }
    });
  });

app.use(function* s() {
  if (__DEVELOPMENT__) {
    webpackIsomorphicTools.refresh();
  }
  isomFetch.use(this, router);
  const result = yield getRouteContext(this);
  if (result !== 'NOT_MATCH') {
    this.body = result;
  }
});

app.listen(PORT, (err) => {
  if (err) {
    debug('error')(err);
  } else {
    debug('server')('==> 🌞  Webpack development server listening on port %s', PORT);
  }
});
