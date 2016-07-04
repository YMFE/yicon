import Router from 'koa-router';
import { getOne, list } from '../modules/repository';
import { getById } from '../modules/icon';
import { getRepoLogs } from '../modules/log';

const general = new Router();

general.get('/repositories', list);
general.get('/repositories/:repoId', getOne);
general.post('/icons', getById);
general.get('/logs/repositories/:repoId', getRepoLogs);

export default general;
