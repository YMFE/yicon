import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import routes from './routes';
import { Provider } from 'react-redux';
import createStore from './reducer';

import DevTools from './containers/DevTools/DevTools';

const history = useRouterHistory(createHistory)({ queryKey: false });
const initialState = window.__INITIAL_STATE__;
const store = createStore(initialState);
const container = document.getElementById('app');

const component = (
  <Router history={history}>
    {routes()}
  </Router>
);

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  container
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    container
  );
}
