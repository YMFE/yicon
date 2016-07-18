import Router from 'koa-router';
import { getIconInfo } from '../modules/icon';
import {
  getAllProjects,
  getOneProject,
  addProjectIcon,
  generatorNewVersion,
  deleteProjectIcon,
  updateProjectInfo,
  updateProjectMember,
} from '../modules/project';
import { getLogList, recordLog } from '../modules/log';
import { getCurrentUser, pagination, isProjectOwner } from './middlewares';

const user = new Router();

user.use(getCurrentUser);

user.get('/icons/:iconId', getIconInfo);

user.get('/projects', getAllProjects);
user.get('/projects/:projectId', getOneProject);
user.get('/projects/:projectId/version/:version', getOneProject);
user.post('/projects/:projectId/update', generatorNewVersion, recordLog);
user.post('/projects/:projectId/icons', addProjectIcon, recordLog);
user.delete('/projects/:projectId/icons', deleteProjectIcon, recordLog);
user.patch('/projects/:projectId', isProjectOwner, updateProjectInfo);
user.patch('/projects/:projectId/members', isProjectOwner, updateProjectMember, recordLog);

user.get('/log/projects/:projectId', pagination, getLogList);

export default user;
