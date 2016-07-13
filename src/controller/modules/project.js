import { User, Project, ProjectVersion } from '../../model';
import { versionTools } from '../../helpers/utils';

export function* getAllProjects(next) {
  const { userId } = this.state.user;

  const user = yield User.findOne({ where: { id: userId } });
  const projects = yield user.getProjects();
  const result = {
    id: userId,
    name: user.name,
    actor: user.actor,
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
  result.isOwner = userId === result.projectOwner.id;

  this.state.respond = result;
  yield next;
}

export function* addProjectIcon(next) {
  const { projectId, icons } = this.param;
  for (let i = 0, len = icons.length; i < len; i++) {
    const isExist = yield ProjectVersion.findOne({
      where: {
        version: '0',
        iconId: icons[i],
        projectId,
      },
    });
    if (!isExist) yield ProjectVersion.create({ version: '0.0.0', iconId: icons[i], projectId });
  }
  yield next;
}
