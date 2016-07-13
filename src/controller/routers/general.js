import Router from 'koa-router';
import { getOne, list } from '../modules/repository';
import { getById, getByCondition } from '../modules/icon';
import { getRepoLogs } from '../modules/log';
import { getAllPublicProjects } from '../modules/project';

import { pagination } from './middlewares';

const general = new Router();

general.get('/repositories', list);
general.get('/repositories/:repoId', getOne);
general.post('/icons', getById);
general.get('/icons', getByCondition);
general.get('/projects', getAllPublicProjects);
general.get('/logs/repositories/:repoId', pagination, getRepoLogs);

export default general;
