import React from 'react';
import { IndexRoute, Route } from 'react-router';
import isomFetch from 'isom-fetch';
import {
  App,
  Home,
  NoMatch,
  Project,
  Repository,
  Transition,
  Notification,
} from './containers';

const fetch = isomFetch.create({ baseURL: '/api' });

export default () => {
  // 处理权限校验
  const requireLogin = (nextState, replace, callback) => {
    fetch
      .post('/validate/login')
      .then(callback)
      .catch(() => {
        // 跳转的时候，如果在这里使用 push，会导致服务端渲染的问题
        // 所以直接 location.href 了
        window.location.href = '/transition/no-login';
      });
  };
  const requireOwner = (nextState, replace, callback) => {
    fetch
      .post('/validate/owner')
      .then(callback)
      .catch(() => { window.location.href = '/transition/no-auth'; });
  };
  const requireAdmin = (nextState, replace, callback) => {
    fetch
      .post('/validate/admin')
      .then(callback)
      .catch(() => { window.location.href = '/transition/no-auth'; });
  };

  return (
    <Route path="/" component={App}>
      {/* 首页路由 */}
      <IndexRoute component={Home} />

      {/* Routes */}
      <Route path="repositories/:id" component={Repository} />
      <Route path="projects/:id(/version/:version)" /> {/* 公开项目 */}
      <Route path="search" /> {/* 搜索结果 */}
      <Route path="transition/:type" component={Transition} /> {/* 跳转页面 */}

      {/* 登录用户路由 */}
      <Route onEnter={requireLogin}>
        <Route path="upload" /> {/* 上传图标 */}
        <Route path="workbench" /> {/* 工作台 */}
        <Route path="user/notifications/projects" /> {/* 项目通知页面 */}
        <Route path="user/notifications(/system)" component={Notification} /> {/* 大库通知页面 */}
        <Route path="user/projects" component={Project} />
        <Route path="user/projects/:id(/version/:version)" />
        <Route path="user/projects/:id/logs" component={Project} />

        {/* 库管用户路由 */}
        <Route onEnter={requireOwner}>
          <Route path="replacement/icon/:id" /> {/* 替换页面 */}
          <Route path="replacement/icon/:fromId...:toId" /> {/* 替换页面 */}
          <Route path="auditing" /> {/* 审核页面 */}
          <Route path="repositories/:id/logs" /> {/* 大库日志 */}
        </Route>

        {/* 超管用户路由 */}
        <Route onEnter={requireAdmin}>
          <Route path="amdin/repositories" /> {/* 大库管理 */}
          <Route path="amdin/projects" /> {/* 项目管理 */}
        </Route>
      </Route>

      {/* Catch all route */}
      <Route path="*" component={NoMatch} />
    </Route>
  );
};
