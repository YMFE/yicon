import Router from 'koa-router';
import { getOne, list } from '../modules/repository';
import { getById } from '../modules/icon';

const general = new Router();

general.get('/repositories', list);
general.get('/repositories/:repoId', getOne);
general.post('/icons', getById);

export default general;
