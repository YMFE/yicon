import config from '../config';
import Q from 'q';
import fs from 'fs';
import path from 'path';

import fontBuilder from 'iconfont-builder';
import SVGO from 'svgo';
import { render } from 'svgexport';
import svgBuilder from './svgTemplate';

const svgo = new SVGO;
const optimize = content => new Promise(resolve => svgo.optimize(content, resolve));

const { caches, font, svg, png } = config.path;
const downPath = path.join(caches, 'download');
const savePath = path.join(caches, 'save');
const downloadPath = {
  font: path.join(caches, font),
  svg: path.join(caches, svg),
  png: path.join(caches, png),
};

/**
 * 检查存放下载路径的文件（夹）是否存在，确保不会出现文件操作错误
 *
 * @param  {String}  name  需要确认的文件（夹）名称
 * @param  {String}  pos   需要确认的文件（夹）类型
 * @return {Promise}       返回 promise
 */
export function ensureCachesExist(name, pos) {
  return Q.nfcall(fs.access, caches)
    .catch(() => Q.nfcall(fs.mkdir, caches))
    .then(() => Q.nfcall(fs.access, downPath))
    .catch(() => Q.nfcall(fs.mkdir, downPath))
    .then(() => Q.nfcall(fs.access, savePath))
    .catch(() => Q.nfcall(fs.mkdir, savePath))
    .then(() => Q.nfcall(fs.access, downloadPath[pos]))
    .catch(() => Q.nfcall(fs.mkdir, downloadPath[pos]))
    .then(() => path.join(caches, font, name));
}

/**
 * 检查文件的修改时间
 *
 * @param  {String}  name  需要确认的文件（夹）名称
 * @param  {String}  pos   需要确认的文件（夹）位置
 * @param  {String}  type  需要确认的文件类型
 * @return {Promise}       返回 promise
 */
export function* getModifyTime(foldName, pos, type) {
  const filePath = path.join(downloadPath[pos], `${foldName}.${type}`);
  // 捕获文件不存在的情况
  try {
    const { mtime } = yield Q.nfcall(fs.stat, filePath);
    return +new Date(mtime);
  } catch (e) {
    return null;
  }
}

export function* saveOriginalSVG(icons) {
  yield ensureCachesExist('hodor', 'svg');
  const stamp = +new Date;
  return Promise.all(icons.map(({ name, buffer }) => {
    const filePath = path.join(savePath, `${name}-${stamp}.svg`);
    return Q.nfcall(fs.writeFile, filePath, buffer);
  }));
}

export function* buildSVG(name, svgPath, color, size) {
  yield ensureCachesExist('hodor', 'svg');
  const svgContent = svgBuilder(size, color, svgPath);
  const optContent = yield optimize(svgContent);
  const filePath = path.join(downloadPath.svg, `${name}.svg`);
  yield Q.nfcall(fs.writeFile, filePath, optContent.data);
  return filePath;
}

export function* buildPNG(name, svgPath) {
  yield ensureCachesExist('hodor', 'png');
  const filePath = path.join(downloadPath.png, `${name}.png`);
  yield Q.nfcall(render, { input: svgPath, output: filePath });
}

export function* transformSvg2Path(param) {
  const matchResult = param.trim().match(/<svg [a-zA-Z0-9\s<>\/="\.:#\-]+<\/svg>$/);
  const adjustedPath = matchResult && Array.isArray(matchResult) && matchResult[0]
    .replace(/(height|width)="([0-9\.]+(px)?)"/g, (all, name) => `${name}="1024"`)
    .replace(/\sversion="[0-9\.]+"/, () => '')
    .replace(/\sclass="icon"/, () => '');
  const buffer = new Buffer(adjustedPath || '');
  const option = {
    icons: [{ name: 'temp', buffer }],
    // 标记只返回图标信息数据
    writeFiles: false,
  };
  const icon = yield fontBuilder(option);
  return icon[0] && icon[0].d;
}
