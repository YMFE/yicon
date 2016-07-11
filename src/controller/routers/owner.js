import Router from 'koa-router';
import { getLogList } from '../modules/log';
import { pagination } from './middlewares';

const owner = new Router();

owner.get('/log/repositories/:repoId', pagination, getLogList);

export default owner;
