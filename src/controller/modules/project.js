import invariant from 'invariant';

import { User, Project, UserProject, ProjectVersion } from '../../model';
import { versionTools, has, diffArray } from '../../helpers/utils';
import { seq } from '../../model/tables/_db';
import { logRecorder } from './log';

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

export function* createProject(next) {
  const { projectName, icons } = this.param;
  const { userId } = this.state.user;
  let projectId;

  invariant(icons.length, '传入的图标数组不应为空');

  icons.forEach(icon => {
    invariant(
      icon.id > 0,
      `期望图标 id 为数字且大于 0，而你传入的是 ${icon.id}`
    );
    invariant(
      typeof icon.name === 'string',
      `期望传入字符串图标名称，而你传入的是 ${icon.name}`
    );
  });

  yield seq.transaction(transaction =>
    Project.findOrCreate({
      where: { name: projectName },
      include: [{
        model: User,
        as: 'projectOwner',
      }],
      defaults: { owner: userId },
    })
    .spread((project, created) => {
      invariant(
        created,
        `图标项目名称 ${project.name} 已存在！您可以联系该项目的创建者 ${
          project.projectOwner ? project.projectOwner.name : ''
        }`
      );
      projectId = project.id;
      const record = icons.map(i => ({
        version: '0.0.0',
        iconId: i.id,
        projectId,
      }));
      return ProjectVersion.bulkCreate(record, { transaction });
    })
    .then(() => {
      const log = [{
        type: 'PROJECT_CREATE',
        loggerId: projectId,
      }, {
        params: { icon: icons },
        type: 'PROJECT_ADD',
        loggerId: projectId,
      }];
      return logRecorder(log, transaction, userId);
    })
  );

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
    type: 'PROJECT_VERSION',
    loggerId: projectId,
    subscribers: affectedUsers,
  };
  yield next;
}

export function* addProjectIcon(next) {
  const { projectId, icons } = this.param;
  const icon = icons.map(v => v.id);
  const data = icon.map(
    (value) => ({ version: '0.0.0', iconId: value, projectId })
  );
  const result = yield ProjectVersion.bulkCreate(data, { ignoreDuplicates: true });
  if (result.length) {
    this.state.respond = '添加项目图标成功';
  } else {
    this.state.respond = '添加的项目图标在项目中均已存在';
  }

  const affectedUsers = yield UserProject.findAll({
    where: { projectId },
    raw: true,
  }).map(v => v.userId);

  this.state.log = {
    params: { icon: icons },
    type: 'PROJECT_ADD',
    loggerId: projectId,
    subscribers: affectedUsers,
  };
  yield next;
}

export function* deleteProjectIcon(next) {
  const { projectId, icons } = this.param;
  const icon = icons.map(v => v.id);
  let result = 0;
  for (let i = 0, len = icon.length; i < len; i++) {
    result += yield ProjectVersion.destroy({
      where: { version: '0.0.0', iconId: icon[i], projectId },
    });
  }
  if (result) {
    this.state.respond = '删除项目图标成功';
  } else {
    this.state.respond = '未删除项目图标';
  }

  const affectedUsers = yield UserProject.findAll({
    where: { projectId },
    raw: true,
  }).map(v => v.userId);

  this.state.log = {
    params: { icon: icons },
    type: 'PROJECT_DEL',
    loggerId: projectId,
    subscribers: affectedUsers,
  };
  yield next;
}

export function* updateProjectInfo(next) {
  if (!this.state.user.isProjectOwner) throw new Error('普通成员无权限修改项目信息');

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
    this.state.respond = '项目信息没有变动';
  }
  yield next;
}

export function* updateProjectMember(next) {
  const { projectId, members } = this.param;
  this.state.log = [];
  if (isNaN(projectId) || members.length < 1) throw new Error('必须传入项目编号和具体成员信息');
  if (!this.state.user.isProjectOwner) throw new Error('普通成员没有权限');
  if (!has(members, { id: this.state.user.ownerId })) throw new Error('参数错误');
  members.forEach(v => {
    if (isNaN(v.id)) throw new Error('参数缺少id');
  });
  const project = yield Project.findOne({ where: { id: projectId } });
  const oldMembers = yield project.getUsers({ attributes: ['id', 'name'], raw: true });
  for (let i = 0, len = oldMembers.length; i < len; i++) {
    delete oldMembers[i]['userProject.projectId'];
    delete oldMembers[i]['userProject.userId'];
  }
  const { deleted, added } = diffArray(oldMembers, members);
  const data = added.map(v => ({ projectId, userId: v.id }));

  yield seq.transaction(t => UserProject.destroy(
    {
      where: {
        userId: { $in: deleted.map(v => v.id) },
      },
      transaction: t,
    }
  ).then(
    () => UserProject.bulkCreate(data, { transaction: t })
  ));

  if (deleted.length) {
    this.state.log.push({
      params: { user: deleted },
      type: 'PROJECT_MEMBER_DEL',
      loggerId: projectId,
      subscribers: members.concat(deleted),
    });
  }
  if (added.length) {
    this.state.log.push({
      params: { user: added },
      type: 'PROJECT_MEMBER_ADD',
      loggerId: projectId,
      subscribers: members,
    });
  }
  if (deleted.length || added.length) {
    this.state.respond = '项目成员更新成功';
  } else {
    this.state.respond = '项目成员没有变动';
  }
  yield next;
}

export function* getAllPublicProjects(next) {
  this.state.respond = yield Project.findAll({
    where: { public: true },
  });
  yield next;
}
