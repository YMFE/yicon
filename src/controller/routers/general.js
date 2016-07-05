import Router from 'koa-router';
import { getOne, list } from '../modules/repository';
import { getById, getByCondition } from '../modules/icon';

const general = new Router();

general.get('/repositories', list);
general.get('/repositories/:repoId', getOne);
general.post('/icons', getById);
general.get('/icons', getByCondition);

export default general;
