'use strict';

var path = require('path');
var fs = require('fs');

require('string.fromcodepoint');
require('string.prototype.codepointat');

function getMetadataService(options) {
  var usedUnicodes = [];

  // Default options
  options = options || {};
  options.appendUnicode = !!options.appendUnicode;
  options.startUnicode = 'number' === typeof options.startUnicode ?
    options.startUnicode :
    0xEA01;
  options.log = options.log || console.log; // eslint-disable-line
  options.err = options.err || console.err; // eslint-disable-line

  return function getMetadataFromFile(file, cb) {
    var basename = path.basename(file);
    var metadata = {
      path: file,
      name: '',
      unicode: [],
      renamed: false,
    };
    var matches = basename.match(/^(?:((?:u[0-9a-f]{4,6},?)+)\-)?(.+)\.svg$/i);

    metadata.name = matches && matches[2] ?
      matches[2] :
      'icon' + options.startUnicode;
    if(matches && matches[1]) {
      metadata.unicode = matches[1].split(',').map(function(match) {
        match = match.substr(1);
        return match.split('u').map(function(code) {
          return String.fromCodePoint(parseInt(code, 16));
        }).join('');
      });
      if(-1 !== usedUnicodes.indexOf(metadata.unicode[0])) {
        return cb(new Error('The unicode codepoint of the glyph ' + metadata.name +
          ' seems to be already used by another glyph.'));
      }
      usedUnicodes = usedUnicodes.concat(metadata.unicode);
    } else {
      do {
        metadata.unicode[0] = String.fromCodePoint(options.startUnicode++);
      } while(-1 !== usedUnicodes.indexOf(metadata.unicode[0]));
      usedUnicodes.push(metadata.unicode[0]);
      if(options.appendUnicode) {
        metadata.renamed = true;
        metadata.path = path.dirname(file) + '/' +
          'u' + metadata.unicode[0].codePointAt(0).toString(16).toUpperCase() +
          '-' + basename;
        fs.rename(file, metadata.path,
          function(err) {
            if(err) {
              return cb(new Error('Could not save codepoint: ' +
                'u' + metadata.unicode[0].codePointAt(0).toString(16).toUpperCase() +
                ' for ' + basename));
            }
            cb(null, metadata);
          }
        );
      }
    }
    if(!metadata.renamed) {
      setImmediate(function() {
        cb(null, metadata);
      });
    }
  };

}

module.exports = getMetadataService;
