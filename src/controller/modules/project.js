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
  const data = icons.map(
    (value) => ({ version: '0.0.0', iconId: value, projectId })
  );
  const result = yield ProjectVersion.bulkCreate(data, { ignoreDuplicates: true });
  if (result) {
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
  if (this.state.user.isOwner) {
    const { projectId, info, name, owner, publicProject } = this.param;
    const data = { info, name, owner, publicProject };
    let projectResult = null;
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
  }
  yield next;
}

export function* updateProjectMember(next) {
  yield next;
}

export function* getAllPublicProjects(next) {
  this.state.respond = yield Project.findAll({
    where: { public: true },
  });
  yield next;
}
