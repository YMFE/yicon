import config from '../config';
import Q from 'q';
// TODO: 前端好像就用不了了
import fs from 'fs';
import path from 'path';

const { caches, download } = config.path;
const downloadPath = path.join(caches, download);

// ============ 下载路径处理 ============ //
export function ensureCachesExist(foldName) {
  return Q.nfcall(fs.access, caches)
    .catch(() => Q.nfcall(fs.mkdir, caches))
    .then(() => Q.nfcall(fs.access, downloadPath))
    .catch(() => Q.nfcall(fs.mkdir, downloadPath))
    .then(() => path.join(caches, download, foldName));
}

// ============ 获取文件的修改时间 ============ //
export function* getModifyTime(foldName) {
  const zipPath = path.join(downloadPath, `${foldName}.zip`);
  // 捕获文件不存在的情况
  try {
    const { mtime } = yield Q.nfcall(fs.stat, zipPath);
    return +new Date(mtime);
  } catch (e) {
    return null;
  }
}
