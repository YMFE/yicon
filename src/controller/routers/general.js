import Router from 'koa-router';
import { getOne, list } from '../modules/repository';
import { getById, getByCondition } from '../modules/icon';
import { getRepoLogs } from '../modules/log';

import { pagination } from './middlewares';
import { getAllProjects, getOneProject } from '../modules/project';

const general = new Router();

general.get('/repositories', list);
general.get('/repositories/:repoId', getOne);
general.post('/icons', getById);
general.get('/icons', getByCondition);
general.get('/logs/repositories/:repoId', pagination, getRepoLogs);
general.get('/projects', getAllProjects);
general.get('/projects/:projectId', getOneProject);

export default general;
