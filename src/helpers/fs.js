import config from '../config';
import Q from 'q';
// TODO: 前端好像就用不了了
import fs from 'fs';
import path from 'path';

// ============ 下载路径处理 ============ //
export function ensureCachesExist(foldName) {
  const { caches, download } = config.path;
  const downloadPath = path.join(caches, download);
  return Q.nfcall(fs.access, caches)
    .catch(() => Q.nfcall(fs.mkdir, caches))
    .then(() => Q.nfcall(fs.access, downloadPath))
    .catch(() => Q.nfcall(fs.mkdir, downloadPath))
    .then(() => path.join(caches, download, foldName));
}
