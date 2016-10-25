var fs = require('fs');
var path = require('path');
var Q = require('q');
var _ = require('underscore');
var mkdirp = require('mkdirp');

var defer = require('./defer');
var generator = require('./fontGenerator');
var parser = require('./svgFontParser');

var DEFAULT_OPTIONS = {
  readFiles: true,
  writeFiles: true,
  fontName: 'iconfont',
  startCodePoint: 0xE000,
  src: '.',
  dest: '.',
  descent: 0
};

/**
 * 入口函数，根据参数生成字体或 icon 对象
 *
 * @param {Object} options 传递参数，详见 readme
 * @returns {Promise}
 */
function builder(options) {
  options = _.extend({}, DEFAULT_OPTIONS, options);
  options.ascent = 1024 - options.descent;

  // 填充 icons 数据
  return fillIcons(options)
    .then(function(icons) {
      options.icons = icons;
      return generator(options);
    })
    .then(function(data) {
      if (options.writeFiles) {
        return writeFonts(data, options);
      } else {
        // 直接返回包含 d 的 icon 数据
        // 注意这里的 data 不是数组，是 svg 文件内容
        return parser.getPathData(data, options);
      }
    });
}

/**
 * 字体写入方法，生成四种字体
 *
 * @param {Array<String>} fonts 字体内容数组
 * @param {Object} options 参数对象
 * @returns {Promise}
 */
function writeFonts(fonts, options) {
  var type = ['svg', 'ttf', 'eot', 'woff', 'html'];

  var fontsQ = _.map(fonts, function(font, i) {
    var filePath = path.join(options.dest, options.fontName + '.' + type[i]);

    var mkdirQ = new Promise(function(resolve, reject) {
      mkdirp(path.dirname(filePath), function(err) {
        err ? reject(err) : resolve()
      })
    })
    var writeFileQ = Q.nfcall(fs.writeFile, filePath, font);

    return mkdirQ.then(writeFileQ);
  });

  return Promise.all(fontsQ);
}

/**
 * 判断是否传入 icons 对象，选择排查或补充
 *
 * @param {Object} options 参数对象
 * @returns {Promise}
 */
function fillIcons(options) {
  // 如果有 icons 数据，确保数据不为空
  if (options.icons) {
    var def = defer();
    var baseCode = options.startCodePoint;
    var codeSet = options.icons.map(function(icon) {
      return icon.codepoint;
    });

    _.each(options.icons, function(icon) {
      // name 是必备的
      if (!icon.name) {
        def.reject(new Error('icon ' + icon.file + ' has no name'));
        return false;
      }
      
      // 如果没有编码，则进行自动生成
      if (!icon.codepoint) {
        while(codeSet.indexOf(baseCode) > -1) {
          baseCode++;
        }
        icon.codepoint = baseCode++;
      }
      icon.xmlCode = '&#x' + icon.codepoint.toString(16) + ';';

      // 有 d 的前提下可以不写 file
      if (!options.readFiles && !icon.d) {
        def.reject(new Error('icon ' + icon.name + ' has no path data(d)'));
        return false;
      }
    });

    def.resolve(options.icons);
    return def.promise;
  } else {
    // 如果没有 icons 数据，从 src 里自动生成
    var base = options.startCodePoint;

    return Q.nfcall(fs.readdir, options.src)
      .then(function(files) {
        var svgFiles = _.filter(files, function(file) {
          return /\.svg$/i.test(file);
        });

        return _.map(svgFiles, function(file) {
          return {
            name: 'glyph-' + base,
            codepoint: base++,
            file: file
          };
        });
      });
  }
}

module.exports = builder;
