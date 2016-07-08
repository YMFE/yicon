import { User, Project } from '../../model';

export function* getAllProjects(next) {
  const userId = 380;

  const user = yield User.findOne({ where: { id: userId } });
  const projects = yield user.getProjects();
  const result = {
    id: userId,
    name: user.dataValues.name,
    actor: user.dataValues.actor,
    organization: projects,
  };

  this.state.respond = result;

  yield next;
}

export function* getOneProject(next) {
  const { projectId, version = '0.0.0' } = this.param;
  let result = {};

  if (projectId === '') throw new Error('不支持传入空参数');

  const project = yield Project.findOne({
    where: { id: projectId },
    attributes: { exclude: ['owner'] },
    include: [{ model: User, as: 'projectOwner' }],
  });
  if (!project) throw new Error('暂无数据');
  result = project.dataValues;

  result.version = version;
  result.icons = yield project.getIcons();
  result.members = yield project.getUsers();
  result.isOwner = true; // 加入用户系统后再修改

  this.state.respond = result;
  yield next;
}
