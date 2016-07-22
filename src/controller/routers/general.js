import Router from 'koa-router';
import { getOne, list } from '../modules/repository';
import { getById, getByCondition } from '../modules/icon';
import { getOneProject, getAllPublicProjects } from '../modules/project';
import { getUserInfo, clearUserInfo } from '../modules/auth';

const general = new Router();

general.get('/repositories', list);
general.get('/repositories/:repoId', getOne);
general.post('/icons', getById);
general.get('/icons', getByCondition);
general.get('/projects', getAllPublicProjects);
general.get('/projects/:projectId', getOneProject);

general.post('/login', getUserInfo);
general.get('/logout', clearUserInfo);

export default general;
