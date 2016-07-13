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
  const { projectId } = this.param;
  let { version = '0.0.0' } = this.param;
  const isPublic = !this.state.user;

  version = versionTools.v2n(version);

  if (isNaN(projectId)) throw new Error('不支持传入空参数');

  // 公开项目需要按照最大版本号获取
  if (isPublic) {
    const getVersion = version
      ? Promise.resolve(version)
      : ProjectVersion.max('version', { where: { projectId } });
    version = yield getVersion;
    if (!version) throw new Error('公开项目未打版本');
  }

  const project = yield Project.findOne({
    where: { id: projectId, public: isPublic },
    attributes: { exclude: ['owner'] },
    include: [{ model: User, as: 'projectOwner' }],
  });
  if (!project) throw new Error('暂无数据');

  const result = project.dataValues;

  result.version = version;
  result.icons = yield project.getIcons({
    through: {
      model: ProjectVersion,
      where: { version },
    },
  });
  result.members = yield project.getUsers();

  if (!isPublic) {
    result.isOwner = this.state.user.userId === result.projectOwner.id;
  }

  this.state.respond = result;
  yield next;
}

export function* getAllPublicProjects(next) {
  this.state.respond = yield Project.findAll({
    where: { public: true },
  });
  yield next;
}
