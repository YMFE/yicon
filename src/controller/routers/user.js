import Router from 'koa-router';
import { getIconInfo, getUploadedIcons } from '../modules/icon';
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
import { getAllNotices, getOneNotice } from '../modules/notification';
import { getCurrentUser, pagination, isProjectOwner } from './middlewares';

const user = new Router();

user.use(getCurrentUser);

user.get('/icons/:iconId', getIconInfo);
user.get('/icons', pagination, getUploadedIcons);

user.get('/projects', getAllProjects);
user.get('/projects/:projectId', getOneProject);
user.get('/projects/:projectId/version/:version', getOneProject);
user.post('/projects/:projectId/update', generatorNewVersion, recordLog);
user.post('/projects/:projectId/icons', addProjectIcon, recordLog);
user.delete('/projects/:projectId/icons', deleteProjectIcon, recordLog);
user.patch('/projects/:projectId', isProjectOwner, updateProjectInfo);
user.patch('/projects/:projectId/members', isProjectOwner, updateProjectMember, recordLog);

user.get('/notifications/type/:type', pagination, getAllNotices);
user.get('/notifications/:nId', getOneNotice);

user.get('/log/projects/:projectId', pagination, getLogList);
// user.get('/notifications(/system)',getSystemInfo);
// user.get('/notifications/projects',getProjectInfo);
export default user;
