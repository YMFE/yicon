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
    .then(() => UserProject.create({ projectId, userId }))
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
  const { userId, model } = this.state.user;
  let { version = '0.0.0' } = this.param;

  version = versionTools.v2n(version);

  invariant(!isNaN(projectId), `项目应该传入合法 id，目前传入的是 ${projectId}`);

  const projects = yield model.getProjects({
    where: { id: projectId },
    include: [{ model: User, as: 'projectOwner' }],
  });

  invariant(projects.length, '未找到项目或当前用户不是项目成员');

  const project = projects[0];
  const result = project.dataValues;

  result.version = versionTools.n2v(version);
  result.icons = yield project.getIcons({
    through: {
      model: ProjectVersion,
      where: { version },
    },
  });
  result.members = yield project.getUsers();
  result.isOwner = project.owner === userId;
  delete result.owner;

  this.state.respond = result;
  yield next;
}

export function* getOnePublicProject(next) {
  const { projectId } = this.param;
  let { version } = this.param;

  invariant(!isNaN(projectId), `项目应该传入合法 id，目前传入的是 ${projectId}`);

  const getVersion = version
    ? Promise.resolve(versionTools.v2n(version))
    : ProjectVersion.max('version', { where: { projectId } });
  version = yield getVersion;
  invariant(version, '本公开项目还没有生成版本，因此无法公开');

  const project = yield Project.findOne({
    where: { id: projectId, public: true },
    attributes: { exclude: ['owner'] },
    include: [{ model: User, as: 'projectOwner' }],
  });
  invariant(project, `未找到 id 为 ${projectId} 的公开项目`);

  const result = project.dataValues;

  result.version = versionTools.n2v(version);
  result.icons = yield project.getIcons({
    through: {
      model: ProjectVersion,
      where: { version },
    },
  });
  result.members = yield project.getUsers();

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
  const project = yield Project.findOne({
    where: { id: projectId },
  });

  invariant(project, `不存在 id 为 ${projectId} 的项目`);

  const icon = icons.map(v => v.id);
  const data = icon.map(value => ({ version: '0.0.0', iconId: value, projectId }));
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
      throw new Error(`项目名已被使用，请更改，如有需要请联系 ${ownerName.name}`);
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
  if (isNaN(projectId) || members.length < 1) {
    throw new Error('必须传入项目编号和具体成员信息');
  }
  if (!this.state.user.isProjectOwner) throw new Error('普通成员没有权限');
  if (!has(members, { id: this.state.user.ownerId })) {
    throw new Error('项目管理员无法被删除');
  }
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

export function* diffVersion(next) {
  const { projectId } = this.param;
  let { highVersion, lowVersion } = this.param;
  if (isNaN(projectId)) throw new Error('缺少项目id参数');

  const project = yield Project.findOne({ where: { id: projectId } });
  const hVersion = versionTools.v2n(highVersion);
  const lVersion = versionTools.v2n(lowVersion);
  if (isNaN(hVersion) && isNaN(lVersion)) throw new Error('缺少对比项目版本号');
  if (hVersion < lVersion) {
    const temp = highVersion;
    highVersion = lowVersion;
    lowVersion = temp;
  }

  let result = { deleted: [], added: [] };
  if (hVersion !== lVersion) {
    const icons = yield project.getIcons({
      through: {
        model: ProjectVersion,
        where: {
          version: {
            $in: [hVersion, lVersion],
          },
        },
      },
    });
    const hvIcons = [];
    const lvIcons = [];
    icons.forEach(v => {
      if (v.projectVersions && v.projectVersions.version === highVersion) {
        hvIcons.push(v);
      } else {
        lvIcons.push(v);
      }
    });
    result = diffArray(lvIcons, hvIcons);
  }
  this.state.respond = this.state.respond || {};
  this.state.respond.deleted = result.deleted;
  this.state.respond.added = result.added;
  yield next;
}

export function* getProjectVersion(next) {
  const { projectId } = this.param;
  if (isNaN(projectId)) throw new Error('缺少参数项目id');
  const project = yield Project.findOne({ attributes: ['name'], where: { id: projectId } });
  const version = yield ProjectVersion.findAll({
    attributes: [[seq.literal('distinct `version`'), 'version']],
    where: { projectId },
  }).map(v => v.version);
  this.state.respond = { project, version };
  yield next;
}

export function* deleteProject(next) {
  const { projectId } = this.param;
  invariant(!isNaN(projectId), '缺少参数项目 id');
  // TODO: 记录日志和发送通知
  const t = seq.transaction(transaction =>
    UserProject
      .destroy({ where: { projectId }, transaction })
      .then(() => ProjectVersion.destroy({ where: { projectId }, transaction }))
      .then(() => Project.destroy({ where: { id: projectId }, transaction }))
  );
  yield t;
  this.state.respond = '项目删除成功';
  yield next;
}
