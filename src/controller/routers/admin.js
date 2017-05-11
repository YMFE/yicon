import Router from 'koa-router';
import {
  updateRepoOwner,
  appointRepoOwner,
  getAdminRepos,
  addRepo,
  searchRepos,
} from '../modules/repository';
import {
  appointProjectOwner,
  getAdminProjects,
  addProject,
  searchProjects,
} from '../modules/project';
import { listAdmin, addAdmin, delAdmin } from '../modules/user';
import {
  getDisabledCode,
  setDisabledCode,
  unSetDisabledCode,
  fetchDisabledCode,
} from '../modules/code';
import { getCurrentUser, isAdmin, pagination } from './middlewares';

const admin = new Router();

admin.use(getCurrentUser);
admin.use(isAdmin);

admin.patch('/repositories/:repoId', updateRepoOwner);

admin.get('/repositories/all', pagination, getAdminRepos);
admin.get('/repositories/all/:name', pagination, searchRepos);
admin.patch('/repositories/:repoId/repo', appointRepoOwner);
admin.post('/repositories', addRepo);

admin.get('/projects/all', pagination, getAdminProjects);
admin.get('/projects/all/:name', pagination, searchProjects);
admin.patch('/projects/:projectId/peoject', appointProjectOwner);
admin.post('/projects', addProject);

admin.get('/disabledCode', getDisabledCode);
admin.post('/disabledCode', setDisabledCode);
admin.patch('/disabledCode/:code', unSetDisabledCode);
admin.get('/disabledCode/github', fetchDisabledCode);

admin.get('/manager/list', listAdmin);
admin.post('/manager/:userId', addAdmin);
admin.delete('/manager/:userId', delAdmin);

export default admin;
