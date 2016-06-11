import Router from 'koa-router';
import { getOne } from '../modules/repository';

const general = new Router();

general.get('/repository/:repoId', getOne);

export default general;
