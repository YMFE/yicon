import Koa from 'koa';
import React from 'react';
import path from 'path';
import routes from './routes';
import ReactDOM from 'react-dom/server';
import compress from 'koa-compress';
import session from 'koa-session-store';
import serve from 'koa-static';
import favicon from 'koa-favicon';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import createStore from './reducer';
import Html from './helpers/Html';

const app = new Koa();

app.use(compress());
app.use(favicon(path.join(__dirname, '../static/favicon.ico')));
app.use(session());
app.use(serve(path.join(__dirname, '../static')));

app.use(function* serverRender() {
  if (__DEVELOPMENT__) {
    webpackIsomorphicTools.refresh();
  }

  match({
    routes: routes(),
    location: this.originalUrl,
  }, (error, redirectLocation, renderProps) => {
    // TODO: 添加前两者的处理
    if (renderProps) {
      const store = createStore();
      const component = (
        <Provider store={store} key="provider">
          <RouterContext {...renderProps} />
        </Provider>
      );

      this.body = `<!DOCTYPE html>\n${
        ReactDOM.renderToString(
          <Html
            assets={webpackIsomorphicTools.assets()}
            component={component}
            store={store}
          />
        )}`;
    }
  });
});

app.listen(process.env.PORT);
