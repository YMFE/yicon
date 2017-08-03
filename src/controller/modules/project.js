import invariant from 'invariant';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

import { PROJECT_NAME } from '../../constants/validate';
import { User, Project, UserProject, ProjectVersion } from '../../model';
import { versionTools, has, diffArray, simpleParse } from '../../helpers/utils';
import { seq } from '../../model/tables/_db';
import { logRecorder } from './log';
import config from '../../config';
import { iconStatus } from '../../constants/utils';

const { infoUrl, versionUrl, sourceUrl, support, cdn } = config.source;
const { serviceUrl } = config.login;

function* listProjects(user) {
  const projects = yield user.getProjects();
  return {
    id: user.id,
    name: user.name,
    actor: user.actor,
    organization: projects,
  };
}

function* getDiffResult(data) {
  const { projectId } = data;
  let { highVersion, lowVersion } = data;
  invariant(projectId > 0, '缺少项目id参数');

  const project = yield Project.findOne({ where: { id: projectId } });
  const hVersion = versionTools.v2n(highVersion);
  const lVersion = versionTools.v2n(lowVersion);
  if (isNaN(hVersion) && isNaN(lVersion)) invariant(false, '缺少对比项目版本号');
  if (hVersion < lVersion) {
    const temp = highVersion;
    highVersion = lowVersion;
    lowVersion = temp;
  }

  let result = { deleted: [], added: [], replaced: [] };
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
    // 此时diffArray：第一个参数为低版本数组，第二个为高版本数组，第三个为是否需要获取替换情况
    // 后端默认版本0.0.0为最高版本，当传入版本中有0.0.0则将它对应的icon数组作为第二个参数传入
    result = !lVersion ? diffArray(hvIcons, lvIcons, true) : diffArray(lvIcons, hvIcons, true);
    // result = diffArray(lvIcons, hvIcons, true);
    result.icons = lvIcons;
  } else {
    const icons = yield project.getIcons();
    result.icons = icons;
  }
  return result;
}

export function* adjustBaseline() {
  const { projectId, baseline } = this.param;

  const project = yield Project.findOne({ where: { id: projectId } });

  invariant(project, `未找到 id 为 ${projectId} 的项目`);
  project.set('baseline', !!baseline);
  yield project.save();
  this.state.respond = { baseline: !!baseline };
}

export function* getAllProjects(next) {
  const { userId } = this.state.user;

  const user = yield User.findOne({ where: { id: userId } });
  const projects = yield listProjects(user);
  const projectList = projects && projects.organization;
  const result = {};
  for (let i = 0, len = projectList && projectList.length || 0; i < len; i++) {
    const projectId = projectList[i] && projectList[i].id;
    const version = yield ProjectVersion.findAll({
      attributes: [[seq.literal('distinct `version`'), 'version']],
      where: { projectId },
      order: 'version',
    }).map(v => v.version);
    if (version && version.length >= 1) {
      const data = yield getDiffResult({
        projectId,
        highVersion: version[version.length - 1],
        lowVersion: '0.0.0',
      });
      const { deleted = [], added = [], replaced = [], icons = [] } = data;
      const disabledNum = icons.filter(icon => icon.status === iconStatus.DISABLED);
      result[`project${projectId}`] =
        replaced.length
        ? disabledNum.length + deleted.length + added.length - 1
        : disabledNum.length + deleted.length + added.length;
    }
  }
  projects.result = result;
  this.state.respond = projects;

  yield next;
}

export function* createProject(next) {
  const { projectName, icons } = this.param;
  const { userId } = this.state.user;
  let projectId;

  invariant(icons.length, '传入的图标数组不应为空');
  invariant(PROJECT_NAME.reg.test(projectName), PROJECT_NAME.message);

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
    .then(() => UserProject.create({ projectId, userId }, { transaction }))
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

  this.state.respond = { projectId };

  yield next;
}

export function* getOneProject(next) {
  const { projectId } = this.param;
  let userId = null;
  let { version = '0.0.0' } = this.param;

  version = versionTools.v2n(version);

  invariant(!isNaN(projectId), `项目应该传入合法 id，目前传入的是 ${projectId}`);

  if (this.state.user) {
    userId = this.state.user.userId;
  }

  const project = yield Project.findOne({
    where: { id: projectId },
    include: [{ model: User, as: 'projectOwner' }],
  });
  invariant(project, `编号${projectId}的项目不存在`);
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

  if (support) result.isSupportSource = true;
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
  const { versionType = 'build', projectId, version } = this.param;
  const versionFrom = yield ProjectVersion.max('version', { where: { projectId } });

  invariant(!isNaN(versionFrom), '空项目不可进行版本升级');

  const project = yield Project.findOne({
    where: { id: projectId },
  });
  invariant(project, `编号${projectId}的项目不存在`);
  const icons = yield project.getIcons({
    through: {
      model: ProjectVersion,
      where: { version: 0 },
    },
  });
  // console.log(icons);
  const disabledCode = [];
  icons.forEach(icon => {
    if (icon.status === iconStatus.DISABLED) {
      disabledCode.push(icon.name);
    }
  });
  const length = disabledCode.length;
  invariant(!length, `项目中的 ${disabledCode.join('、')} 等图标被系统占用，请先删除，再下载或同步`);

  const versionTo = version || versionTools.update(versionFrom, versionType);

  const versions = yield ProjectVersion.findAll({
    where: { projectId, version: '0.0.0' },
    order: 'iconId',
  });
  const currentHighestVersion = yield ProjectVersion.findAll({
    attributes: ['iconId'],
    where: { projectId, version: versionFrom },
    order: 'iconId',
    raw: true,
  });
  const baseVersion = versions.map(v => ({ iconId: v.iconId }));
  const isEqual = JSON.stringify(baseVersion) === JSON.stringify(currentHighestVersion);
  invariant(!isEqual || versionFrom === 0 || version, '当前版本与最高版本一致，无需重新生成版本');

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
  yield ProjectVersion.bulkCreate(data, { ignoreDuplicates: true });
  this.state.respond = { projectId };

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
      where: { version: 0, iconId: icon[i], projectId },
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
  invariant(this.state.user.isProjectOwner, '普通成员无权限修改项目信息');

  const { projectId, info, name, owner, publicProject } = this.param;
  const data = { info, name, owner, public: publicProject };
  let projectResult = null;
  invariant(name, '项目名不可以为空');
  const existProject = yield Project.findOne({
    where: { name, id: { $notIn: [projectId] } },
    raw: true,
  });
  if (existProject) {
    const ownerName = yield User.findOne({ where: { id: existProject.owner }, raw: true });
    invariant(false, `项目名已被使用，请更改，如有需要请联系 ${ownerName.name}`);
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
    invariant(false, '必须传入项目编号和具体成员信息');
  }
  invariant(this.state.user.isProjectOwner, '普通成员没有权限');
  if (!has(members, { id: this.state.user.ownerId })) {
    invariant(false, '项目管理员无法被删除');
  }
  members.forEach(v => {
    invariant(!isNaN(v.id), `项目成员 id 应为数字，您传入的是 ${v.id}`);
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
        projectId,
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
  const result = yield getDiffResult(this.param);
  this.state.respond = this.state.respond || {};
  this.state.respond.deleted = result.deleted;
  this.state.respond.added = result.added;
  this.state.respond.replaced = result.replaced;
  yield next;
}

export function* getProjectVersion(next) {
  const { projectId } = this.param;
  invariant(projectId > 0, '缺少参数项目id');
  const project = yield Project.findOne({ attributes: ['name'], where: { id: projectId } });
  const version = yield ProjectVersion.findAll({
    attributes: [[seq.literal('distinct `version`'), 'version']],
    where: { projectId },
    order: 'version',
  }).map(v => v.version);
  this.state.respond = { project, version };
  yield next;
}

export function* deleteProject(next) {
  const { projectId } = this.param;
  const { model } = this.state.user;
  invariant(projectId > 0, '缺少参数项目 id');
  // TODO: 记录日志和发送通知
  const t = seq.transaction(transaction =>
    UserProject
      .destroy({ where: { projectId }, transaction })
      .then(() => ProjectVersion.destroy({ where: { projectId }, transaction }))
      .then(() => Project.destroy({ where: { id: projectId }, transaction }))
  );
  yield t;
  this.state.respond = yield listProjects(model);
  yield next;
}

export function* addProject(next) {
  const { name } = this.param;
  let { owner } = this.param;
  const { userId } = this.state.user;
  invariant(
    PROJECT_NAME.reg.test(name),
    `项目名称长度为 1-30，只能有英文、数字、连字符和下划线，您输入的是 ${name}`
  );
  owner = owner || userId;
  invariant(owner > 0, `管理员 id 期望输入数字，您输入的是 ${owner}`);
  const projectInfo = yield Project.findOne({
    where: { name },
    include: [{
      model: User,
      as: 'projectOwner',
    }],
  });
  const { projectOwner } = projectInfo || {};
  invariant(!projectInfo, `项目名称 ${name} 已被占用，如有需要，请联系创建者${projectOwner && projectOwner.name}`);
  const user = yield User.findOne({ where: { id: owner } });
  invariant(user && user.id > 0, '没有指定的用户信息');

  const t = seq.transaction(transaction =>
    Project.create({ name, owner }, { transaction })
    .then((created) => {
      this.state.respond = created;
      return UserProject.create({
        projectId: created.id,
        userId: user.id,
      }, { transaction });
    })
    .then((userProject) => {
      const subscribers = [];
      if (userProject.userId !== userId) {
        subscribers.push(userProject.userId);
      }
      const log = {
        type: 'PROJECT_CREATE',
        loggerId: userProject.projectId,
        subscribers,
      };
      return logRecorder(log, transaction, userProject.userId);
    })
  );
  yield t;
  yield next;
}

export function* appointProjectOwner(next) {
  const { projectId, name } = this.param;
  const { userId } = this.state.user;
  invariant(projectId > 0, `项目 id 期望输入数字，您输入的是 ${projectId}`);
  invariant(typeof name === 'string', `项目管理员名称应为字符串，您输入的是 ${name}`);

  const allMembers = [];
  const project = yield Project.findOne({ where: { id: projectId } });
  const memberInfo = yield project.getUsers({ attributes: ['id', 'name'], raw: true });
  const oldOwner = {};
  memberInfo.forEach(v => {
    allMembers.push({ id: v.id, name: v.name });
    if (v.id === project.owner) Object.assign(oldOwner, { id: v.id, name: v.name });
  });
  const newOwner = yield User.findOne({
    attributes: ['id', 'name'],
    where: { name },
    raw: true,
  });
  if (oldOwner === null || newOwner === null) invariant(false, '没有指定的用户信息');
  if (oldOwner.id === newOwner.id) invariant(false, '指定的用户已是项目管理员');

  // 将 newOwner 插入 allMembers
  const hasNewOwner = allMembers.some(m => m.id === newOwner.id);
  if (!hasNewOwner) allMembers.push(newOwner);

  const t = seq.transaction(transaction =>
      Promise.all([
        Project.update({ owner: newOwner.id }, { where: { id: projectId }, transaction }),
        UserProject.bulkCreate(
          [{ projectId, userId: newOwner.id }],
          { transaction, ignoreDuplicates: true }
        ),
      ])
    .then(() => {
      const log = {
        params: {
          userFrom: oldOwner,
          userTo: newOwner,
        },
        type: 'PROJECT_OWNER',
        loggerId: projectId,
        subscribers: allMembers,
      };
      return logRecorder(log, transaction, userId);
    })
  );

  yield t;
  yield next;
}

export function* getAdminProjects(next) {
  const { pageMixin } = this.state;

  const project = yield Project.findAndCountAll({
    attributes: ['id', 'name'],
    include: [{
      model: User,
      as: 'projectOwner',
    }],
    order: 'id desc',
    ...pageMixin,
  });
  this.state.respond = project.rows.map(
    v => Object.assign({}, { id: v.id, name: v.name, ownerName: v.projectOwner.name })
  );
  this.state.page.totalCount = project.count;
  yield next;
}

export function* searchProjects(next) {
  const { name } = this.param;
  const { pageMixin } = this.state;
  invariant(name, '请传入待查询的项目名称');

  const project = yield Project.findAndCountAll({
    attributes: ['id', 'name'],
    where: {
      name: { $like: `%${name}%` },
    },
    include: [{
      model: User,
      as: 'projectOwner',
    }],
    ...pageMixin,
  });
  this.state.respond = project.rows.map(
    v => Object.assign({}, { id: v.id, name: v.name, ownerName: v.projectOwner.name })
  );
  this.state.page.totalCount = project.count;
  yield next;
}

// 配置项目 source 路径
export function* addSourcePath(next) {
  const { projectId, path } = this.param;
  const { userId } = this.state.user;
  const project = yield Project.findOne({ where: { id: projectId } });
  invariant(project, `未找到 id 为 ${projectId} 的项目`);
  const user = yield User.findOne({ where: { id: userId } });
  const sourceProjectName = path.split('/')[0] || project.name;
  const result = yield axios.get(simpleParse(infoUrl, {
    project: sourceProjectName,
    user: user.name,
  }));
  const resultData = result.data || {};
  invariant(typeof resultData !== 'string', 'source服务异常');
  invariant(resultData.ret, resultData.data);
  // 向数据库中插入 source 路径配置信息
  // 去掉首尾（连续）的 "/" 并在末尾自动加上一个 "/"
  let _path = '';
  _path = this.param && `${path.replace(/(^\/*)|(\/*$)/g, '')}/`;
  const data = yield Project.update(
    { source: encodeURIComponent(_path) },
    { where: { id: projectId } }
  );
  invariant(data, 'source 路径配置失败');
  this.state.respond = 'source 路径配置成功';
  yield next;
}

// 获取项目 source 上最高版本
export function* getSourceVersion(next) {
  const { projectId } = this.param;
  const project = yield Project.findOne({ where: { id: projectId }, raw: true });
  invariant(project.source, '上传图标到 source 前请项目负责人先配置路径信息');
  const path = decodeURIComponent(project.source);
  const sourceProjectName = path.split('/')[0] || project.name;
  const sourcePath = path.split('/').slice(1).join('/') || '/';
  const data = yield axios.get(simpleParse(versionUrl, {
    project: sourceProjectName,
    branch: 'master',
    path: encodeURIComponent(sourcePath),
  }));
  const res = { version: '0.0.0', ...project };
  if (data.data && data.data.ret) {
    res.version = data.data.data && data.data.data.version;
  }
  this.state.respond = res;
  yield next;
}

// 上传图标到 source
export function* uploadSource(next) {
  const { projectId, project, path, branch, version } = this.param;
  const { userId } = this.state.user;
  const user = yield User.findOne({ where: { id: userId } });
  const form = new FormData();
  // 获取字体文件
  const file = yield axios.post(`${serviceUrl}/api/download/font`, {
    type: 'project',
    id: projectId,
  });
  if (file.data && !file.data.res) {
    return;
  }
  // TODO: 文件路径需要修改
  const { fontDest } = file && file.data && file.data.data;
  let result = {};
  const sourcePath = path.split('/').slice(1).join('/') || '/';
  if (file.data && file.data.res && fs.existsSync(fontDest)) {
    const data = fs.createReadStream(fontDest);
    const sourceProjectName = path.split('/')[0] || project;
    form.append('username', user.name);
    form.append('project', sourceProjectName);
    form.append('path', sourcePath);
    form.append('branch', branch);
    form.append('version', version);
    form.append('zip', data);
    const getHeaders = () => new Promise((resolve, reject) => {
      form.getLength((err, length) => {
        if (err) {
          reject(err);
        }
        const headers = Object.assign({ 'Content-Length': length }, form.getHeaders());
        resolve(headers);
      });
    });
    result = yield getHeaders().then(headers => axios.post(sourceUrl, form, { headers }));
  }
  if (result.data && result.data.ret) {
    const url = result.data && result.data && result.data.data.sourceUrl;
    this.state.respond = `${cdn}/${url}${project}`;
    // 配置项目 log
    this.state.log = {
      params: { path: sourcePath, version },
      type: 'SOURCE_PUBLISH',
      loggerId: projectId,
      subscribers: [],
    };
  } else {
    invariant(result.ret, '上传图标到 source 失败');
  }
  yield next;
}
