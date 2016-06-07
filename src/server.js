import Express from 'express';
import React from 'react';
import path from 'path';
import routes from './routes';
import ReactDOM from 'react-dom/server';
import favicon from 'serve-favicon';
import compression from 'compression';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import createStore from './reducer';
import Html from './helpers/Html';

const app = new Express();

app.use(compression());
app.use(favicon(path.join(__dirname, '../static/favicon.ico')));
app.use(Express.static(path.join(__dirname, '../static')));

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    webpackIsomorphicTools.refresh();
  }

  match({
    routes: routes(),
    location: req.originalUrl,
  }, (error, redirectLocation, renderProps) => {
    // TODO: 添加前两者的处理
    if (renderProps) {
      const store = createStore();
      const component = (
        <Provider store={store} key="provider">
          <RouterContext {...renderProps} />
        </Provider>
      );

      res.status(200);
      res.send(`<!DOCTYPE html>\n${
        ReactDOM.renderToString(
          <Html
            assets={webpackIsomorphicTools.assets()}
            component={component}
            store={store}
          />
        )}`);
    }
  });
});

app.listen(process.env.PORT);
