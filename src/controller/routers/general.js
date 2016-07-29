import Router from 'koa-router';
import { getOne, list, listWithoutIcons } from '../modules/repository';
import { getById, getByCondition, downloadIcons, getIconInfo } from '../modules/icon';
import { getOnePublicProject, getAllPublicProjects } from '../modules/project';
import { getUserInfo, clearUserInfo, validateAuth } from '../modules/user';
import { pagination } from './middlewares';

const general = new Router();

general.get('/repositories', list);
general.get('/tiny/repositories', listWithoutIcons);
general.get('/repositories/:repoId', pagination, getOne);
general.post('/icons', getById);
general.get('/icons', getByCondition);
general.get('/projects', getAllPublicProjects);
general.get('/projects/:projectId', getOnePublicProject);
general.post('/download', downloadIcons);

general.get('/icons/:iconId', getIconInfo);
general.post('/login', getUserInfo);
general.get('/logout', clearUserInfo);
general.post('/validate/:type', validateAuth);

export default general;
