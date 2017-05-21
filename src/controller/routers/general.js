import Router from 'koa-router';
import { getOne, list, listWithoutIcons } from '../modules/repository';
import { getById, getByCondition, getIconInfo } from '../modules/icon';
import { downloadFont, downloadSingleIcon } from '../modules/download';
import {
  getAllPublicProjects,
  getProjectVersion,
  getOneProject,
} from '../modules/project';
import { clearUserInfo, validateAuth } from '../modules/user';
import { getUserInfo } from '../modules/login';
import { getLdapAuth } from '../modules/ldapauth';
import { statistic } from '../modules/statistic';
// import { pagination } from './middlewares';

const general = new Router();

general.get('/repositories', list);
general.get('/tiny/repositories', listWithoutIcons);
general.get('/repositories/:repoId', getOne);
general.post('/icons', getById);
general.get('/icons', getByCondition);
general.get('/projects', getAllPublicProjects);
general.get('/projects/:projectId/versions', getProjectVersion);
general.get('/projects/:projectId', getOneProject);
general.get('/projects/:projectId/version/:version', getOneProject);
general.post('/download/font', downloadFont);
general.post('/download/icon/:type', downloadSingleIcon);
general.get('/statistics/size/:size/number/:number', statistic);

general.get('/icons/:iconId', getIconInfo);
general.post('/login', getUserInfo);
general.get('/login', getUserInfo);
general.post('/ldapauth', getLdapAuth);
general.get('/logout', clearUserInfo);
general.post('/validate/:type', validateAuth);

export default general;
