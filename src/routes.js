import React from 'react';
import { IndexRoute, Route } from 'react-router';
import {
  App,
  Home,
  Project,
  Repository,
} from './containers';

export default () => {
  // 处理权限校验
  const requireLogin = () => {};

  return (
    <Route path="/" component={App}>
      {/* 首页路由 */}
      <IndexRoute component={Home} />

      {/* Routes requiring login */}
      <Route onEnter={requireLogin}>
        <Route path="project" component={Project} />
      </Route>

      {/* Routes */}
      <Route path="repository" component={Repository} />

      {/* Catch all route */}
    </Route>
  );
};
