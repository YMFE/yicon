import { User, Project, UserProject, ProjectVersion } from '../../model';
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

export function* addProjectIcon(next) {
  const { projectId, icons } = this.param;
  const data = icons.map(
    (value) => ({ version: '0.0.0', iconId: value, projectId })
  );
  const result = yield ProjectVersion.bulkCreate(data, { ignoreDuplicates: true });
  if (result.length) {
    this.state.respond = '添加项目图标成功';
  } else {
    this.state.respond = '添加项目图标失败';
  }
  yield next;
}

export function* deleteProjectIcon(next) {
  const { projectId, icons } = this.param;
  let result = 0;
  for (let i = 0, len = icons.length; i < len; i++) {
    result += yield ProjectVersion.destroy({
      where: { version: '0.0.0', iconId: icons[i], projectId },
    });
  }
  if (result) {
    this.state.respond = '删除项目图标成功';
  } else {
    this.state.respond = '删除项目图标失败';
  }
  yield next;
}

export function* updateProjectInfo(next) {
  if (!this.state.user.isOwner) throw new Error('没有权限');

  const { projectId, info, name, owner, publicProject } = this.param;
  const data = { info, name, owner, public: publicProject };
  let projectResult = null;
  if (name) {
    const existProject = yield Project.findOne({ where: { name }, raw: true });
    if (existProject) {
      const ownerName = yield User.findOne({ where: { id: existProject.owner }, raw: true });
      throw new Error(`项目名已被使用，请更改，如有需要请联系${ownerName.name}`);
    }
  }
  const key = Object.keys(data);
  key.forEach((v) => {
    if (data[v] === undefined) delete data[v];
  });
  if (Object.keys(data).length) {
    projectResult = yield Project.update(data, { where: { id: projectId } });
  }
  if (projectResult) {
    this.state.respond = '项目信息更新成功';
  } else {
    this.state.respond = '项目信息更新失败';
  }
  yield next;
}

export function* updateProjectMember(next) {
  const { projectId, members } = this.param;
  let deleteMember = null;
  let result = null;
  let flag = true; // 标志位，当是owner且删除数据成功时flag才会重置为true

  if (projectId && members.length) {
    if (this.state.user.isOwner && members.indexOf(this.state.user.ownerId) > -1) {
      flag = false;
      let oldMember = yield UserProject.findAll({ where: { projectId }, raw: true });
      oldMember = oldMember.map((v) => v.userId);
      deleteMember = oldMember.filter((value) => members.indexOf(value) === -1);
      const deleteCount = yield UserProject.destroy({ where: { projectId } });
      if (deleteCount) flag = true;
    }
    const data = members.map(
      (value) => ({ projectId, userId: value })
    );
    result = yield UserProject.bulkCreate(data, { ignoreDuplicates: true });
  }
  if (result && flag) {
    this.state.respond = '项目成员更新成功';
  } else {
    this.state.respond = '项目成员更新失败';
  }
  this.state.log = {
    params: { user: deleteMember },
    subscribers: members.concat(deleteMember),
  };
  yield next;
}

export function* getAllPublicProjects(next) {
  this.state.respond = yield Project.findAll({
    where: { public: true },
  });
  yield next;
}
