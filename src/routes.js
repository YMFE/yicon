import React from 'react';
import { IndexRoute, Route } from 'react-router';
import isomFetch from 'isom-fetch';
import process from 'process';
import {
  App,
  Home,
  Demo,
  NoMatch,
  Project,
  Repository,
  Transition,
  Search,
  Notification,
  Uploaded,
} from './containers';

const fetch = isomFetch.create({ baseURL: '/api' });

const validate = (type, transition) => (nextState, replace, next) => {
  if (process.browser) {
    fetch
      .post(`/validate/${type}`)
      .then(data => {
        if (!data.res) {
          window.location.href = `/transition/${transition}`;
        }
        next();
      })
      .catch(() => next());
  } else {
    next();
  }
};

export default () => {
  // 处理权限校验
  const requireLogin = validate('login', 'no-login');
  const requireOwner = validate('owner', 'no-auth');
  const requireAdmin = validate('admin', 'no-auth');

  return (
    <Route path="/" component={App}>
      {/* 首页路由 */}
      <IndexRoute component={Home} />

      {/* Routes */}
      <Route path="repositories/:id" component={Repository} />
      <Route path="projects/:id(/version/:version)" /> {/* 公开项目 */}
      <Route path="search" /> {/* 搜索结果 */}
      <Route path="transition/:type" component={Transition} /> {/* 跳转页面 */}
      <Route path="search" component={Search} /> {/* 搜索结果 */}
      <Route path="demo" component={Demo} /> {/* demo */}

      {/* 登录用户路由 */}
      <Route onEnter={requireLogin}>
        <Route path="upload" component={NoMatch} /> {/* 上传图标 */}
        <Route path="workbench" /> {/* 工作台 */}
        <Route path="user/notifications/projects" /> {/* 项目通知页面 */}
        <Route path="user/notifications(/system)" component={Notification} /> {/* 大库通知页面 */}
        <Route path="user/projects" component={Project} />
        <Route path="user/projects/:id(/version/:version)" />
        <Route path="user/projects/:id/logs" component={Project} />
        <Route path="user/icons" component={Uploaded} />
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
