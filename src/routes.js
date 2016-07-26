import React from 'react';
import { IndexRoute, Route } from 'react-router';
import {
  App,
  Home,
  Demo,
  NoMatch,
  Project,
  Repository,
  Notification,
} from './containers';

export default () => {
  // 处理权限校验
  const requireLogin = () => {};
  const requireOwner = () => {};
  const requireAdmin = () => {};

  return (
    <Route path="/" component={App}>
      {/* 首页路由 */}
      <IndexRoute component={Home} />

      {/* Routes */}
      <Route path="repositories/:id" component={Repository} />
      <Route path="projects/:id(/version/:version)" /> {/* 公开项目 */}
      <Route path="search" /> {/* 搜索结果 */}
      <Route path="demo" component={Demo} /> {/* demo */}

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
