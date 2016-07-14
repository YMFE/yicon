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

export function* generatorNewVersion(next) {
  const { versionType = 'build', projectId } = this.param;
  const versionFrom = yield ProjectVersion.max('version', { where: { projectId } });

  if (isNaN(versionFrom)) throw new Error('空项目不可进行版本升级');

  const versionTo = versionTools.update(versionFrom, versionType);

  const versions = yield ProjectVersion.findAll({
    where: { projectId, version: '0.0.0' },
  });
  const rawData = versions.map(v => ({
    ...v.get({ plain: true }), version: versionTo,
  }));

  this.state.respond = yield ProjectVersion.bulkCreate(rawData);

  const affectedProject = yield Project.findOne({
    where: { id: projectId },
    include: [User],
  });
  const affectedUsers = affectedProject.get({ plain: true }).users.map(v => v.id);

  // 配置项目 log
  this.state.log = {
    params: {
      versionFrom: versionTools.n2v(versionFrom),
      versionTo,
    },
    loggerId: projectId,
    subscribers: affectedUsers,
  };

  yield next;
}

export function* getAllPublicProjects(next) {
  this.state.respond = yield Project.findAll({
    where: { public: true },
  });
  yield next;
}
