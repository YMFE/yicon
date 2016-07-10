import Router from 'koa-router';
import { getAllProjects, getOneProject } from '../modules/project';
import { getCurrentUser } from './middlewares';

const user = new Router();

user.use(getCurrentUser);

user.get('/projects', getAllProjects);
user.get('/projects/:projectId', getOneProject);
user.get('/projects/:projectId/version/:version', getOneProject);

export default user;
