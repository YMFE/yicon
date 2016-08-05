import React from 'react';
import { IndexRoute, Route } from 'react-router';
import isomFetch from 'isom-fetch';
import {
  App,
  Audit,
  Home,
  Demo,
  Log,
  NoMatch,
  Project,
  ProjectLog,
  Repository,
  Transition,
  Search,
  Notification,
  UserProject,
  Upload,
  Workbench,
  Uploaded,
  VersionComparison,
  Authority,
} from './containers';

const fetch = isomFetch.create({ baseURL: '/api' });

const validate = (type, transition) => (nextState, replace, next) => {
  fetch
    .post(`/validate/${type}`)
    .then(data => {
      if (!data.res) {
        replace(`/transition/${transition}`);
        // window.location.href = `/transition/${transition}`;
      }
      next();
    })
    .catch(() => next());
};

export default (store) => {
  // 处理权限校验
  const requireLogin = validate('login', 'no-login', store);
  const requireOwner = validate('owner', 'no-auth', store);
  const requireAdmin = validate('admin', 'no-auth', store);

  return (
    <Route path="/" component={App}>
      {/* 首页路由 */}
      <IndexRoute component={Home} />

      {/* Routes */}
      <Route path="repositories/:id" component={Repository} />
      <Route path="projects" component={Project} /> {/* 公开项目 */}
      <Route path="projects/:id(/version/:version)" component={Project} /> {/* 公开项目 */}
      <Route path="transition/:type" component={Transition} /> {/* 跳转页面 */}
      <Route path="search" component={Search} /> {/* 搜索结果 */}
      <Route path="demo" component={Demo} /> {/* demo */}

      {/* 登录用户路由 */}
      <Route onEnter={requireLogin}>
        <Route path="upload" component={Upload} /> {/* 上传图标 */}
        <Route path="workbench" component={Workbench} /> {/* 工作台 */}
        <Route path="user/notifications/projects" /> {/* 项目通知页面 */}
        <Route path="user/notifications(/system)" component={Notification} /> {/* 大库通知页面 */}
        <Route path="user/projects" component={UserProject} />
        <Route path="user/projects/:id(/version/:version)" component={UserProject} />
        <Route path="user/projects/:id/logs" component={ProjectLog} />
        <Route path="user/icons" component={Uploaded} />
        <Route path="user/projects/:id/comparison" component={VersionComparison} />
        {/* 库管用户路由 */}
        <Route onEnter={requireOwner}>
          <Route path="replacement/icon/:id" /> {/* 替换页面 */}
          <Route path="replacement/icon/:fromId...:toId" /> {/* 替换页面 */}
          <Route path="auditing" component={Audit} /> {/* 审核页面 */}
          <Route path="repositories/:id/logs" component={Log} /> {/* 大库日志 */}
        </Route>

        {/* 超管用户路由 */}
        <Route onEnter={requireAdmin}>
          <Route path="admin/repositories" /> {/* 大库管理 */}
          <Route path="admin/projects" /> {/* 项目管理 */}
          <Route path="admin/authority/:type" component={Authority} /> {/* 权限设置 */}
        </Route>
      </Route>

      {/* Catch all route */}
      <Route path="*" component={NoMatch} />
    </Route>
  );
};
