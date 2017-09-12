// 提供给第三方调用的接口
import fs from 'fs';
import path from 'path';
import invariant from 'invariant';
import axios from 'axios';
import { Project, ProjectVersion, User } from '../../model';
import {
  getAllVersion,
  getDiffResult,
 } from './project';
import { versionTools } from '../../helpers/utils';
import watcher from '../../helpers/watcher';
import config from '../../config';
const { serviceUrl } = config.login;

// 项目工作区图标与项目生成的最高版本间是否有图标变化
function* projectChangeLog(data) {
  const { projectId, version } = data;
  invariant(version !== '0.0.0', '该项目尚未生成稳定版本');
  const result = yield getDiffResult({
    projectId,
    highVersion: version,
    lowVersion: '0.0.0',
  });
  const { deleted, added, replaced } = result;
  return { hasChange: !!(deleted.length || added.length || replaced.length) };
}

export function* downloadFontForThirdParty(next) {
  // 接口调用开始时间
  const startTime = (new Date()).getTime();
  const { name, type, version } = this.params;
  invariant(['ttf', 'eot', 'svg', 'woff'].indexOf(type) > -1, `${type}格式的字体不存在`);
  invariant(version !== '0.0.0', '该版本不支持下载');

  const project = yield Project.findOne({ where: { name } });
  const { id } = project || {};
  invariant(id, `项目${name}不存在`);

  // 获取所有版本
  const allVersions = yield getAllVersion({ projectId: id });
  const versions = allVersions && allVersions.version || [];
  invariant(
    Array.isArray(versions) && versions.indexOf(version) > -1,
    `该项目没有${version}版本`
  );
  const maxVersion = versions[versions.length - 1];
  invariant(version === maxVersion, `当前${version}版本已过期，不可下载`);

  const file = yield axios.post(`${serviceUrl}/api/download/font`, {
    type: 'project',
    id,
  });
  const { fontDest = '' } = file && file.data && file.data.data || {};
  const dest = fontDest.replace('.zip', '');
  const fontPath = path.join(dest, `${name}.${type}`);
  let isSuccess = false;
  if (fs.existsSync(path.join(fontPath))) {
    this.set('Content-disposition', `attachment; filename=${name}.${type}`);
    this.set('Content-type', 'application/octet-stream');
    isSuccess = true;
    this.body = fs.createReadStream(fontPath);
  } else {
    this.status = 500;
    this.body = `无法找到对应下载的文件：${name}`;
  }
  // 接口调用结束时间
  const endTime = (new Date()).getTime();
  // 请求持续时间（）
  const duration = endTime - startTime;

  // 添加监控，查看第三方接口下载量，接口调用持续时间等
  if (isSuccess && fontDest) {
    watcher('font-download-thirdparty-success', 1);
    watcher('font-download-duration-success', duration / 1000);
  } else {
    watcher('font-download-thirdparty-fail', 1);
    watcher('font-download-duration-fail', duration / 1000);
  }
  yield next;
}

export function* getProjectInfo(next) {
  const { projectName } = this.param;
  // 查询项目基本信息
  const project = yield Project.findOne({
    where: { name: projectName },
    include: [{ model: User, as: 'projectOwner' }],
  });
  const { id, info, projectOwner } = project || {};
  invariant(id, `项目${projectName}不存在`);

  // 获取所有版本
  const allVersions = yield getAllVersion({ projectId: id });
  const versions = allVersions && allVersions.version || [];

  const projectInfo = {
    id,
    name: projectName,
    info,
    owner: projectOwner && projectOwner.name || '',
    latest_version: null,
    latest_info: null,
    has_change: false,
    versions: versions.slice(1),
    message: '',
  };
  if (versions.length <= 1) {
    projectInfo.message = '该项目尚未生成稳定版本';
  } else {
    const version = versions[versions.length - 1];
    // 检查对应版本图标是否有变更
    const result = yield projectChangeLog({
      projectId: id,
      version,
    });
    if (result.hasChange) {
      projectInfo.has_change = true;
      projectInfo.message = '该项目存在图标变更，请重新生成新版本';
    }
    // 获取项目图标
    const icons = yield project.getIcons({
      attributes: ['id', 'name', 'code'],
      through: {
        model: ProjectVersion,
        where: { version: versionTools.v2n(version) },
      },
    });
    projectInfo.latest_version = version;
    projectInfo.latest_info = {
      version,
      icons: icons.map((icon) => ({
        id: icon.id,
        name: icon.name,
        code: icon.code,
      })),
      download: {
        eot: `${serviceUrl}/download/name/${projectName}/type/eot/version/${version}`,
        svg: `${serviceUrl}/download/name/${projectName}/type/svg/version/${version}`,
        ttf: `${serviceUrl}/download/name/${projectName}/type/ttf/version/${version}`,
        woff: `${serviceUrl}/download/name/${projectName}/type/woff/version/${version}`,
      },
    };
  }
  this.state.respond = projectInfo;
  yield next;
}

export function* getProjectInfoByVersion(next) {
  const { projectName, version } = this.param;
  // 查询项目基本信息
  const project = yield Project.findOne({
    where: { name: projectName },
    include: [{ model: User, as: 'projectOwner' }],
  });
  const { id, info, projectOwner } = project || {};
  invariant(id, `项目${projectName}不存在`);

  // 获取所有版本
  const allVersions = yield getAllVersion({ projectId: id });
  const versions = allVersions && allVersions.version || [];
  if (version) {
    invariant(
      Array.isArray(versions) && versions.indexOf(version) > 0,
      `该项目没有${version}版本`
    );
  }

  const projectInfo = {
    id,
    name: projectName,
    info,
    owner: projectOwner && projectOwner.name || '',
    version,
    icons: [],
    download: null,
    message: '',
  };
  const icons = yield project.getIcons({
    attributes: ['id', 'name', 'code'],
    through: {
      model: ProjectVersion,
      where: { version: versionTools.v2n(version) },
    },
  });
  projectInfo.icons = icons.map((icon) => ({
    id: icon.id,
    name: icon.name,
    code: icon.code,
  }));
  if (version !== versions[versions.length - 1]) {
    projectInfo.message = `当前${version}版本已过期，请使用最新版`;
  } else {
    // 获取项目图标
    projectInfo.download = {
      eot: `${serviceUrl}/download/name/${projectName}/type/eot/version/${version}`,
      svg: `${serviceUrl}/download/name/${projectName}/type/svg/version/${version}`,
      ttf: `${serviceUrl}/download/name/${projectName}/type/ttf/version/${version}`,
      woff: `${serviceUrl}/download/name/${projectName}/type/woff/version/${version}`,
    };
  }
  this.state.respond = projectInfo;
  yield next;
}
