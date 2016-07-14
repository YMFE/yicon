import Router from 'koa-router';
import {
  getAllProjects,
  getOneProject,
  addProjectIcon,
  deleteProjectIcon,
  updateProjectInfo,
  updateProjectMember,
} from '../modules/project';
import { getLogList } from '../modules/log';
import { getCurrentUser, pagination, isProjectOwner } from './middlewares';

const user = new Router();

user.use(getCurrentUser);

user.get('/projects', getAllProjects);
user.get('/projects/:projectId', getOneProject);
user.get('/projects/:projectId/version/:version', getOneProject);
user.post('/projects/:projectId/icons', addProjectIcon);
user.delete('/projects/:projectId/icons', deleteProjectIcon);
user.patch('/projects/:projectId', isProjectOwner, updateProjectInfo);
user.patch('/projects/:projectId/members', isProjectOwner, updateProjectMember);

user.get('/log/projects/:projectId', pagination, getLogList);

export default user;
