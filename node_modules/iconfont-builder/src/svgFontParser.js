var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var handlebars = require('handlebars');
var svgp = require('svgpath');

var sax = require('sax');
var parser = require('sax').parser();

function getPathData(svgContent, options) {
  var icons = options.icons;
  parser.onopentag = function(node) {
    if (node.name === 'GLYPH') {
      var attributes = node.attributes;
      var name = attributes['GLYPH-NAME'];
      var d = attributes['D'];
      _.each(icons, function(icon) {
        if (icon.name === name) {
          icon.d = d;
          return false;
        }
      });
    }
  };

  parser.write(svgContent).close();
  return icons;
}

function getSvgIcon(options) {
  var tmpPath = path.join(__dirname, '../template/svg.handlebars');
  return Q.nfcall(fs.readFile, tmpPath, 'utf-8')
    .then(function(source) {
      var template = handlebars.compile(source);
      // 在使用纯 path 写入 svg 时，支持进行字体偏移量调整
      // 通过 buffer 和文件读入的就先不管了……
      if (options.translate) {
        options.icons.map(function(icon) {
          icon.d = svgp(icon.d).translate(0, options.translate);
        });
      }
      return template(options);
    });
}

exports.getPathData = getPathData;
exports.getSvgIcon = getSvgIcon;