import Router from 'koa-router';
import { updateRepoOwner } from '../modules/repository';
import { getCurrentUser, isAdmin } from './middlewares';

const admin = new Router();

admin.use(getCurrentUser);
admin.use(isAdmin);

admin.patch('/repositories/:repoId', updateRepoOwner);

export default admin;
