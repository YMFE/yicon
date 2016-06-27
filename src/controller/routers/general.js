import Router from 'koa-router';
import { getOne, list } from '../modules/repository';

const general = new Router();

general.get('/repositories', list);
general.get('/repositories/:repoId', getOne);

export default general;
