import Router from 'koa-router';
import { getOne, list } from '../modules/repository';
import { getById, getByCondition, downloadIcons } from '../modules/icon';
import { getOneProject, getAllPublicProjects } from '../modules/project';
import { getUserInfo, clearUserInfo, validateAuth } from '../modules/auth';

const general = new Router();

general.get('/repositories', list);
general.get('/repositories/:repoId', getOne);
general.post('/icons', getById);
general.get('/icons', getByCondition);
general.get('/projects', getAllPublicProjects);
general.get('/projects/:projectId', getOneProject);
general.post('/download', downloadIcons);

general.post('/login', getUserInfo);
general.get('/logout', clearUserInfo);
general.post('/validate/:type', validateAuth);

export default general;
