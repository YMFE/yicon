import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import routes from './routes';
import { Provider, connect } from 'react-redux';
import createStore from './reducer';

import DevTools from './containers/DevTools/DevTools';

const history = useRouterHistory(createHistory)({ queryKey: false });
const initialState = window.__INITIAL_STATE__;
const store = createStore(initialState);
const container = document.getElementById('app');

@connect(
  state => ({ devTools: state.setting.devTools })
)
class DevToolsContainer extends Component {
  render() {
    return (
      <div>
        {this.props.devTools && <DevTools />}
      </div>
    );
  }
}

DevToolsContainer.propTypes = {
  devTools: PropTypes.bool,
};

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger
}

ReactDOM.render(
  <Provider store={store} key="provider">
    <div>
      <Router history={history}>
        {routes()}
      </Router>
      <DevToolsContainer />
    </div>
  </Provider>,
  container
);
