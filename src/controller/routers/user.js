import Router from 'koa-router';
import {
  getAllProjects,
  getOneProject,
  addProjectIcon,
  generatorNewVersion,
  deleteProjectIcon,
  updateProjectInfo,
  updateProjectMember,
} from '../modules/project';
// import {
//     getSystemInfo,
//     getProjectInfo
// } from '../modules/notifications';
import { getLogList, recordLog } from '../modules/log';
import { getCurrentUser, pagination, isProjectOwner } from './middlewares';

const user = new Router();

user.use(getCurrentUser);

user.get('/projects', getAllProjects);
user.get('/projects/:projectId', getOneProject);
user.get('/projects/:projectId/version/:version', getOneProject);
user.post('/projects/:projectId/update', generatorNewVersion, recordLog);
user.post('/projects/:projectId/icons', addProjectIcon);
user.delete('/projects/:projectId/icons', deleteProjectIcon);
user.patch('/projects/:projectId', isProjectOwner, updateProjectInfo);
user.patch('/projects/:projectId/members', isProjectOwner, updateProjectMember);
user.get('/log/projects/:projectId', pagination, getLogList);
// user.get('/notifications(/system)',getSystemInfo);
// user.get('/notifications/projects',getProjectInfo);
export default user;
