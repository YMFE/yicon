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

// ============ 获取最大的 repo 时间戳 ============ //
export function* getLastestStamp(foldPrefix) {
  const regFold = new RegExp(`${foldPrefix}-(\\d+).zip$`);
  const dir = yield Q.nfcall(fs.readdir, downloadPath);
  const matchedDir = dir
    .filter(d => regFold.test(d))
    .map(d => d.match(regFold)[1])
    .sort();
  const len = matchedDir.length;
  return len ? +matchedDir[matchedDir.length - 1] : null;
}
