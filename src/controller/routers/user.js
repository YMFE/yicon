import Router from 'koa-router';
import multer from '../../helpers/multer';
import {
  getAllProjects,
  getOneProject,
  addProjectIcon,
  generatorNewVersion,
  deleteProjectIcon,
  updateProjectInfo,
  updateProjectMember,
} from '../modules/project';
import {
  uploadIcons,
  getUploadIcons,
  submitIcons,
  getIconInfo,
} from '../modules/icon';

import { getLogList, recordLog } from '../modules/log';
import { getCurrentUser, pagination, isProjectOwner } from './middlewares';

const user = new Router();
const storage = multer.memoryStorage();
const uploader = multer({ storage });

user.use(getCurrentUser);

user.post('/icons', uploader.array('icon', 20), uploadIcons);
user.get('/icons', getUploadIcons);
user.patch('/icons', submitIcons);
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
