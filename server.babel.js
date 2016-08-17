var fs = require('fs');
var path = require('path');
var rootDir = path.resolve(__dirname);

var babelrc = fs.readFileSync(path.join(rootDir, '.babelrc'));
var config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

require('babel-register')(config);
