#!/usr/bin/env node

// 定时任务，删除 caches 目录中的项目字体文件、小车直接下载的临时字体文件
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var cachesFontDir = path.join(__dirname, '../../caches/download/font');

function isExistSync(path) {
  try {
    fs.statSync(path);
  } catch(e) {
    return false;
  }
  return true;
}

if (isExistSync(cachesFontDir)) {
  // 存在该目录，则执行下述操作
  fs.readdir(cachesFontDir, function(err, files) {
    if (err) throw new Error(err);
    files.forEach(function(file) {
      var filePath = path.join(cachesFontDir, file);
      const regExp = /^project-|temporary_/;
      // 删除项目字体文件、小车直接下载的临时字体文件
      // 大库字体文件不能直接删除，当存在的大库字体文件的时间戳比最后更改日期晚，会直接用对应的文件
      if (fs.existsSync(filePath) && regExp.test(file)) {
        child_process.execSync('rm -rf ' + filePath);
      }
    });
  });
} else {
  console.log(cachesFontDir + '没有找到');
}
