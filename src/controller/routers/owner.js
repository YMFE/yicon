import Router from 'koa-router';
import { updateRepoNotice } from '../modules/repository';
import { getLogList } from '../modules/log';
import { getAuditList, auditIcons } from '../modules/icon';
import { pagination, getCurrentUser, isRepoOwner } from './middlewares';

const owner = new Router();

owner.use(getCurrentUser);
owner.use(isRepoOwner);

owner.patch('/repositories/:repoId', updateRepoNotice);
owner.get('/log/repositories/:repoId', pagination, getLogList);
owner.get('/icons', getAuditList);
owner.post('/icons', auditIcons);

export default owner;
