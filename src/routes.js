import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { clearRepositoryData } from './actions/repository';
import {
  App,
  Home,
  Project,
  Repository,
} from './containers';

export default (store) => {
  // 处理权限校验
  const requireLogin = () => {};
  const clearState = (type) => (
    (
      (action) => (
        () => { store.dispatch(action); }
      )
    )(type)
  );

  return (
    <Route path="/" component={App}>
      {/* 首页路由 */}
      <IndexRoute component={Home} />

      {/* Routes requiring login */}
      <Route onEnter={requireLogin}>
        <Route path="project" component={Project} />
      </Route>

      {/* Routes */}
      <Route
        path="repositories/:id"
        component={Repository}
        onLeave={clearState(clearRepositoryData())}
      />

      {/* Catch all route */}
    </Route>
  );
};
