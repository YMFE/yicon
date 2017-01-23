import zip from 'zip-dir';
import Q from 'q';
import invariant from 'invariant';
import fontBuilder from 'iconfont-builder';

import { iconStatus } from '../../constants/utils';
import { versionTools } from '../../helpers/utils';
import { Repo, Project, Icon, RepoVersion, ProjectVersion } from '../../model';
import { ensureCachesExist, getModifyTime } from '../../helpers/fs';

export function* buildFont(next) {
  const { type, id, icons } = this.param;
  let { version } = this.param;
  let { fontName } = this.param;
  let iconData;
  let foldName;
  let lastModify = null;
  let baselineShouldBeAdjusted = true;

  const isRepo = type === 'repo';
  if (Array.isArray(icons) && icons.length) {
    iconData = yield Icon.findAll({
      where: { id: { $in: icons }, status: iconStatus.RESOLVED },
      attributes: [
        ['fontClass', 'name'],
        ['code', 'codepoint'],
        ['path', 'd'],
      ],
      raw: true,
    });
    foldName = `temporary_${+new Date}`;
    fontName = fontName || 'iconfont';
  } else {
    const model = isRepo ? Repo : Project;
    const throughModel = isRepo ? RepoVersion : ProjectVersion;
    const instance = yield model.findOne({ where: { id } });

    // 仅对项目进行处理，迫使每次下载都是最新版本
    if (!isRepo) {
      const getVersion = version
        ? Promise.resolve(version)
        : ProjectVersion.max('version', { where: { projectId: id } });
      version = yield getVersion;
      baselineShouldBeAdjusted = !!instance.baseline;
    } else {
      version = 0;
    }

    invariant(instance, `不存在 id 为 ${id} 的 ${isRepo ? '大库' : '项目'}`);

    iconData = yield instance.getIcons({
      attributes: [
        ['fontClass', 'name'],
        ['code', 'codepoint'],
        ['path', 'd'],
      ],
      through: {
        model: throughModel,
        where: { version },
      },
      where: { status: iconStatus.RESOLVED },
      raw: true,
    });
    foldName = `${type}-${isRepo ? instance.id : instance.name}-${versionTools.n2v(version)}`;
    fontName = fontName || (isRepo ? `iconfont${instance.id}` : instance.name);
    if (isRepo) {
      lastModify = +new Date(instance.updatedAt);
    }
  }

  const fontDest = yield ensureCachesExist(foldName, 'font');
  let needReBuild = true;
  // 如果是大库则检查一下当前文件是否过期
  if (isRepo) {
    const modifyTime = yield getModifyTime(foldName, 'font', 'zip');
    needReBuild = !modifyTime || modifyTime < lastModify;
  }
  // 除了大库已存在副本之外，项目和单独下载都需要 rebuild
  if (needReBuild) {
    const zipDest = `${fontDest}.zip`;
    yield fontBuilder({
      icons: iconData,
      readFiles: false,
      dest: fontDest,
      descent: baselineShouldBeAdjusted ? 128 : 0,
      fontName,
      translate: baselineShouldBeAdjusted ? -128 : 0,
    });
    yield Q.nfcall(zip, fontDest, { saveTo: zipDest });
  }
  this.state.respond = `${fontDest}.zip`;
  yield next;
}
