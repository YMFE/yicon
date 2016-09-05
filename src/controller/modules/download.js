import zip from 'zip-dir';
import Q from 'q';
import invariant from 'invariant';
import fontBuilder from 'iconfont-builder';

import { iconStatus } from '../../constants/utils';
import { versionTools } from '../../helpers/utils';
import { Repo, Project, Icon, RepoVersion, ProjectVersion } from '../../model';
import { ensureCachesExist, getModifyTime, buildSVG, buildPNG } from '../../helpers/fs';

/**
 * 由于 SVG 每次都会选择颜色和 size
 * 所以这里的生成我们每次都会生成新文件
 */
export function* downloadSingleIcon(next) {
  const { iconId, type, color, size } = this.param;
  const icon = yield Icon.findOne({ where: { id: iconId } });

  invariant(icon, `id 为 ${iconId} 的图标不存在`);

  const { id, path, fontClass } = icon;
  // 由于 png 依赖 svg 文件的生成，因此必须先生成 svg
  const fileName = /^[\w]+-/.test(fontClass) ? fontClass : id;
  const svgPath = yield buildSVG(fileName, path, color, size);
  if (type === 'png') {
    yield buildPNG(fileName, svgPath);
  }
  this.state.respond = `${fileName}.${type}`;

  yield next;
}

/**
 * 下载字体接口，参数 icons 的优先级最高
 * 这里，当下载项为大库时，我们会查看大库的最后更改日期
 * 如果存在的文件的时间戳比最后更改日期晚，就直接用对应的文件好了
 *
 * 项目之所以不这么处理是因为这里 tmd 有个坑：
 * 图标替换的时候是直接替换的 svg 路径
 * 因此所有的项目目前不太容易感知是否发生了变化
 *
 */
export function* downloadFont(next) {
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
      descent: 128,
      fontName,
      translate: baselineShouldBeAdjusted ? -128 : 0,
    });
    yield Q.nfcall(zip, fontDest, { saveTo: zipDest });
  }
  this.state.respond = `${foldName}.zip`;
  yield next;
}
