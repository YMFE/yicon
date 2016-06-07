import React from 'react';
import { IndexRoute, Route } from 'react-router';
import {
  Home,
  Project,
  Repository,
} from './containers';

export default () => {
  // 处理权限校验
  const requireLogin = () => {};

  return (
    <Route path="/" component={Home}>
      {/* Home (main) route */}
      <IndexRoute component={Home} />

      {/* Routes requiring login */}
      <Route onEnter={requireLogin}>
        <Route path="project" component={Project} />
      </Route>

      {/* Routes */}
      <Route path="repository" component={Repository} />

      {/* Catch all route */}
      <Route path="*" component={Home} status={404} />
    </Route>
  );
};
