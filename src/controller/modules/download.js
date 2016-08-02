import zip from 'zip-dir';
import Q from 'q';
import fontBuilder from 'iconfont-builder';
import { iconStatus } from '../../constants/utils';
import { Repo, Project, Icon, RepoVersion, ProjectVersion } from '../../model';
import { ensureCachesExist, getModifyTime } from '../../helpers/fs';

/**
 * 下载单个图标的接口，当然，这里不是下载字体了
 * 这里包含下载 svg 和 png
 *
 * 我们使用 modifyTime 的方式，在下载的时候才生成对应的文件
 */
export function* downloadSingleIcon(next) {
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
  const { type, id, version = '0.0.0', icons } = this.param;
  let { fontName } = this.param;
  let iconData;
  let foldName;
  let lastModify = null;

  const isRepo = type === 'repo';
  if (Array.isArray(icons) && icons.length) {
    iconData = yield Icon.findAll({
      where: { id: { $in: icons }, status: iconStatus.RESOLVED },
      attributes: [
        ['fontClass', 'name'],
        ['code', 'codepoint'],
        ['path', 'd'],
      ],
    });
    foldName = +new Date;
    fontName = fontName || 'iconfont';
  } else {
    const model = isRepo ? Repo : Project;
    const throughModel = isRepo ? RepoVersion : ProjectVersion;
    const instance = yield model.findOne({ where: { id } });
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
    foldName = `${type}-${instance.id}-${version}`;
    fontName = fontName || (isRepo ? instance.alias : instance.name);
    if (isRepo) {
      lastModify = +new Date(instance.updatedAt);
    }
  }

  const fontDest = yield ensureCachesExist(foldName);
  let needReBuild = true;
  // 如果是大库则检查一下当前文件是否过期
  if (isRepo) {
    const modifyTime = yield getModifyTime(foldName);
    needReBuild = !modifyTime || modifyTime < lastModify;
  }
  // 除了大库已存在副本之外，项目和单独下载都需要 rebuild
  if (needReBuild) {
    const zipDest = `${fontDest}.zip`;
    yield fontBuilder({
      icons: iconData,
      readFiles: false,
      dest: fontDest,
      fontName,
    });
    yield Q.nfcall(zip, fontDest, { saveTo: zipDest });
  }
  this.state.respond = `${foldName}.zip`;
  yield next;
}
