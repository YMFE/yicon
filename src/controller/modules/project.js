import { User, Project, ProjectVersion } from '../../model';
import { versionTools } from '../../helpers/utils';

export function* getAllProjects(next) {
  const { userId } = this.state.user;

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
  const { userId } = this.state.user;
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
  result.icons = yield project.getIcons({
    through: {
      model: ProjectVersion,
      where: { version: versionTools.v2n(version) },
    },
  });
  result.members = yield project.getUsers();
  result.isOwner = userId === result.projectOwner.dataValues.id;

  this.state.respond = result;
  yield next;
}
