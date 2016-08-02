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
  getProjectVersion,
  deleteProject,
} from '../modules/project';
import {
  uploadIcons,
  getSubmittedIcons,
  submitIcons,
  deleteIcons,
  updateIconInfo,
  getUploadedIcons,
} from '../modules/icon';

import { getUserByName } from '../modules/user';
import { getLogList, recordLog } from '../modules/log';
import { getAllNotices, getOneNotice } from '../modules/notification';
import { getCurrentUser, pagination, isProjectOwner } from './middlewares';

const user = new Router();
const storage = multer.memoryStorage();
const uploader = multer({ storage });

user.use(getCurrentUser);

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
user.post('/projects/:projectId/update', generatorNewVersion, recordLog);
user.post('/projects/:projectId/icons', addProjectIcon, recordLog);
user.delete('/projects/:projectId/icons', deleteProjectIcon, recordLog);
user.patch('/projects/:projectId', isProjectOwner, updateProjectInfo);
user.patch('/projects/:projectId/members', isProjectOwner, updateProjectMember, recordLog);
user.delete('/projects/:projectId', isProjectOwner, deleteProject);
// user.get('/projects/:projectId/compareVersion/:highVersion...:lowVersion', diffVersion);
user.get('/projects/:projectId/version/:highVersion/version/:lowVersion', diffVersion);
user.get('/projects/:projectId/versions', getProjectVersion);

user.get('/notifications/type/:type', pagination, getAllNotices);
user.get('/notifications/:nId', getOneNotice);

user.get('/log/projects/:projectId', pagination, getLogList);

user.get('/list', getUserByName);

export default user;
