import Router from 'koa-router';
import {
  getAllProjects,
  getOneProject,
  generatorNewVersion,
} from '../modules/project';
import { getLogList, recordLog } from '../modules/log';
import { getCurrentUser, pagination } from './middlewares';

const user = new Router();

user.use(getCurrentUser);

user.get('/projects', getAllProjects);
user.get('/projects/:projectId', getOneProject);
user.get('/projects/:projectId/version/:version', getOneProject);
user.post('/projects/:projectId/update', generatorNewVersion, recordLog);

user.get('/log/projects/:projectId', pagination, getLogList);

export default user;
