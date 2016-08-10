/* eslint-disable no-console */
import { exec } from 'child_process';

const localPath = './';
const serverPath = 'l-iconfont1.h.dev.cn0:/home/q/www/yicon.qunar.com/webapp';
const options = '-rzxv --timeout=10 --chmod=\'a=rX,u+w\' --rsync-path=\'sudo rsync\'';
const syncCommand = `rsync ${options} ${localPath} ${serverPath}`;
console.log(syncCommand);

exec(syncCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
