import Router from 'koa-router';
import multer from '../../helpers/multer';
import { updateRepoNotice } from '../modules/repository';
import { getLogList } from '../modules/log';
import { uploadReplacingIcon, replaceIcon, updateIconUploader } from '../modules/icon';
import { getAuditList, auditIcons } from '../modules/audit';
import { pagination, getCurrentUser, isRepoOwner } from './middlewares';

const owner = new Router();
const storage = multer.memoryStorage();
const uploader = multer({ storage });

owner.use(getCurrentUser);
owner.use(isRepoOwner);

owner.patch('/repositories/:repoId', updateRepoNotice);
owner.get('/log/repositories/:repoId', pagination, getLogList);
owner.post('/replacement', uploader.single('icon'), uploadReplacingIcon);
owner.post('/replacement/icon/:fromId...:toId', replaceIcon);
owner.get('/icons', getAuditList);
owner.post('/icons', auditIcons);
owner.patch('/uploader/icon/:iconId', updateIconUploader);

export default owner;
