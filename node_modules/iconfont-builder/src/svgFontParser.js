var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var handlebars = require('handlebars');

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
      return template(options);
    });
}

exports.getPathData = getPathData;
exports.getSvgIcon = getSvgIcon;