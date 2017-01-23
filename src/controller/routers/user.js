import Router from 'koa-router';
import multer from '../../helpers/multer';

import {
  createProject,
  getAllProjects,
  getOneProject,
  addProjectIcon,
  generatorNewVersion,
  deleteProjectIcon,
  updateProjectInfo,
  updateProjectMember,
  diffVersion,
  deleteProject,
  adjustBaseline,
  addSourcePath,
  getSourceVersion,
  uploadSource,
} from '../modules/project';
import {
  uploadIcons,
  getSubmittedIcons,
  submitIcons,
  deleteIcons,
  updateIconInfo,
  getUploadedIcons,
} from '../modules/icon';

import { getUserByName, getUserSessionInfo } from '../modules/user';
import { getLogList, recordLog } from '../modules/log';
import { getAllNotices, getOneNotice, getUnreadCount } from '../modules/notification';
import { getCurrentUser, pagination, isProjectMember, isProjectOwner } from './middlewares';

const user = new Router();
const storage = multer.memoryStorage();
const uploader = multer({ storage });

user.use(getCurrentUser);

user.post('/info', getUserSessionInfo);
user.post('/icons', uploader.array('icon', 20), uploadIcons);
user.patch('/icons', submitIcons);
user.get('/workbench', getUploadedIcons);
user.get('/icons', pagination, getSubmittedIcons);
user.delete('/icons/:iconId', deleteIcons);
user.patch('/icons/:iconId', updateIconInfo);

user.get('/projects', getAllProjects);
user.post('/projects', createProject);
user.get('/projects/:projectId', getOneProject);
user.get('/projects/:projectId/version/:version', getOneProject);
user.post('/projects/:projectId/update', isProjectMember, generatorNewVersion, recordLog);
user.post('/projects/:projectId/icons', isProjectMember, addProjectIcon, recordLog);
user.delete('/projects/:projectId/icons', isProjectMember, deleteProjectIcon, recordLog);
user.patch('/projects/:projectId', isProjectOwner, updateProjectInfo);
user.patch('/projects/:projectId/members', isProjectOwner, updateProjectMember, recordLog);
user.delete('/projects/:projectId', isProjectOwner, deleteProject);
user.patch('/projects/:projectId/baseline', isProjectOwner, adjustBaseline);
user.get('/projects/:projectId/version/:highVersion/version/:lowVersion', diffVersion);
user.post('/projects/:projectId/source', isProjectOwner, addSourcePath);
user.get('/projects/:projectId/source/version', isProjectOwner, getSourceVersion);
user.post('/projects/:projectId/source/upload', isProjectOwner, uploadSource, recordLog);

user.get('/notifications/type/:type', pagination, getAllNotices);
user.get('/notifications/:logId', getOneNotice);
user.get('/unread/notifications', getUnreadCount);

user.get('/log/projects/:projectId', pagination, getLogList);

user.get('/list', getUserByName);

export default user;
