 /* eslint no-multi-str:0 */

'use strict';

// Required modules
var util = require('util');
var ucs2 = require('punycode').ucs2;
var Stream = require('readable-stream');
var Sax = require('sax');
var SVGPathData = require('svg-pathdata');
var svgShapesToPath = require('./svgshapes2svgpath');

require('string.prototype.codepointat');

// Transform helpers (will move elsewhere later)
function parseTransforms(value) {
  return value.match(
     /(rotate|translate|scale|skewX|skewY|matrix)\s*\(([^\)]*)\)\s*/g
  ).map(function(transform) {
    return transform.match(/[\w\.\-]+/g);
  });
}
function transformPath(path, transforms) {
  transforms.forEach(function(transform) {
    path[transform[0]].apply(path, transform.slice(1).map(function(n) {
      return parseFloat(n, 10);
    }));
  });
  return path;
}
function applyTransforms(d, parents) {
  var transforms = [];

  parents.forEach(function(parent) {
    if('undefined' !== typeof parent.attributes.transform) {
      transforms = transforms.concat(parseTransforms(parent.attributes.transform));
    }
  });
  return transformPath(new SVGPathData(d), transforms).encode();
}

// Rendering
function tagShouldRender(curTag, parents) {
  var values;

  return !parents.some(function(tag) {
    if('undefined' !== typeof tag.attributes.display &&
      'none' === tag.attributes.display.toLowerCase()) {
      return true;
    }
    if('undefined' !== typeof tag.attributes.width &&
      0 === parseFloat(tag.attributes.width, 0)) {
      return true;
    }
    if('undefined' !== typeof tag.attributes.height &&
      0 === parseFloat(tag.attributes.height, 0)) {
      return true;
    }
    if('undefined' !== typeof tag.attributes.viewBox) {
      values = tag.attributes.viewBox.split(/\s*,*\s|\s,*\s*|,/);
      if(0 === parseFloat(values[2]) || 0 === parseFloat(values[3])) {
        return true;
      }
    }
  });
}

// Inherit of duplex stream
util.inherits(SVGIcons2SVGFontStream, Stream.Transform);

// Constructor
function SVGIcons2SVGFontStream(options) {
  var _this = this;
  var glyphs = [];
  var log;

  options = options || {};
  options.fontName = options.fontName || 'iconfont';
  options.fontId = options.fontId || options.fontName;
  options.fixedWidth = options.fixedWidth || false;
  options.descent = options.descent || 0;
  options.round = options.round || 10e12;
  options.metadata = options.metadata || '';

  log = options.log || console.log.bind(console); // eslint-disable-line

  // Ensure new were used
  if(!(this instanceof SVGIcons2SVGFontStream)) {
    return new SVGIcons2SVGFontStream(options);
  }

  // Parent constructor
  Stream.Transform.call(this, {
    objectMode: true,
  });

  // Setting objectMode separately
  this._writableState.objectMode = true;
  this._readableState.objectMode = false;

  // Parse input
  this._transform = function _svgIcons2SVGFontStreamTransform(
    svgIconStream, unused, svgIconStreamCallback
  ) {
    // Parsing each icons asynchronously
    var saxStream = Sax.createStream(true);
    var parents = [];
    var glyph = svgIconStream.metadata || {};

    glyph.d = [];
    glyphs.push(glyph);

    if('string' !== typeof glyph.name) {
      _this.emit('error', new Error('Please provide a name for the glyph at' +
        ' index ' + (glyphs.length - 1)));
    }
    if(glyphs.some(function(anotherGlyph) {
      return (anotherGlyph !== glyph && anotherGlyph.name === glyph.name);
    })) {
      _this.emit('error', new Error('The glyph name "' + glyph.name +
        '" must be unique.'));
    }
    if(glyph.unicode && glyph.unicode instanceof Array && glyph.unicode.length) {
      if(glyph.unicode.some(function(unicodeA, i) {
        return glyph.unicode.some(function(unicodeB, j) {
          return i !== j && unicodeA === unicodeB;
        });
      })) {
        _this.emit('error', new Error('Given codepoints for the glyph "' +
          glyph.name + '" contain duplicates.'));
      }
    } else if('string' !== typeof glyph.unicode) {
      _this.emit('error', new Error('Please provide a codepoint for the glyph "' +
        glyph.name + '"'));
    }

    if(glyphs.some(function(anotherGlyph) {
      return (anotherGlyph !== glyph && anotherGlyph.unicode === glyph.unicode);
    })) {
      _this.emit('error', new Error('The glyph "' + glyph.name +
        '" codepoint seems to be used already elsewhere.'));
    }

    saxStream.on('opentag', function(tag) {
      var values;

      parents.push(tag);
      // Checking if any parent rendering is disabled and exit if so
      if(!tagShouldRender(tag, parents)) {
        return;
      }
      try {
        // Save the view size
        if('svg' === tag.name) {
          glyph.dX = 0;
          glyph.dY = 0;
          if('viewBox' in tag.attributes) {
            values = tag.attributes.viewBox.split(/\s*,*\s|\s,*\s*|,/);
            glyph.dX = parseFloat(values[0], 10);
            glyph.dY = parseFloat(values[1], 10);
            glyph.width = parseFloat(values[2], 10);
            glyph.height = parseFloat(values[3], 10);
          }
          if('width' in tag.attributes) {
            glyph.width = parseFloat(tag.attributes.width, 10);
          }
          if('height' in tag.attributes) {
            glyph.height = parseFloat(tag.attributes.height, 10);
          }
          if(!glyph.width || !glyph.height) {
            log('Glyph "' + glyph.name + '" has no size attribute on which to' +
              ' get the gylph dimensions (heigh and width or viewBox' +
              ' attributes)');
            glyph.width = 150;
            glyph.height = 150;
          }
        // Clipping path unsupported
        } else if('clipPath' === tag.name) {
          log('Found a clipPath element in the icon "' + glyph.name + '" the' +
            'result may be different than expected.');
        // Change rect elements to the corresponding path
        } else if('rect' === tag.name && 'none' !== tag.attributes.fill) {
          glyph.d.push(applyTransforms(svgShapesToPath.rectToPath(tag.attributes), parents));
        } else if('line' === tag.name && 'none' !== tag.attributes.fill) {
          log('Found a line element in the icon "' + glyph.name + '" the result' +
            ' could be different than expected.');
          glyph.d.push(applyTransforms(svgShapesToPath.lineToPath(tag.attributes), parents));
        } else if('polyline' === tag.name && 'none' !== tag.attributes.fill) {
          log('Found a polyline element in the icon "' + glyph.name + '" the' +
            ' result could be different than expected.');
          glyph.d.push(applyTransforms(svgShapesToPath.polylineToPath(tag.attributes), parents));
        } else if('polygon' === tag.name && 'none' !== tag.attributes.fill) {
          glyph.d.push(applyTransforms(svgShapesToPath.polygonToPath(tag.attributes), parents));
        } else if('circle' === tag.name || 'ellipse' === tag.name &&
          'none' !== tag.attributes.fill) {
          glyph.d.push(applyTransforms(svgShapesToPath.circleToPath(tag.attributes), parents));
        } else if('path' === tag.name && tag.attributes.d &&
          'none' !== tag.attributes.fill) {
          glyph.d.push(applyTransforms(tag.attributes.d, parents));
        }
      } catch(err) {
        _this.emit('error', new Error('Got an error parsing the glyph' +
          ' "' + glyph.name + '": ' + err.message + '.'));
      }
    });

    saxStream.on('error', function svgicons2svgfontSaxErrorCb(err) {
      _this.emit('error', err);
    });

    saxStream.on('closetag', function svgicons2svgfontSaxCloseTagCb() {
      parents.pop();
    });

    saxStream.on('end', function svgicons2svgfontSaxEnbCb() {
      svgIconStreamCallback();
    });

    svgIconStream.pipe(saxStream);
  };

  // Output data
  this._flush = function _svgIcons2SVGFontStreamFlush(svgFontFlushCallback) {
    var fontWidth = (
      1 < glyphs.length ?
      glyphs.reduce(function(curMax, glyph) {
        return Math.max(curMax, glyph.width);
      }, 0) :
      glyphs[0].width);
    var fontHeight = options.fontHeight || (
      1 < glyphs.length ? glyphs.reduce(function(curMax, glyph) {
        return Math.max(curMax, glyph.height);
      }, 0) :
      glyphs[0].height);

    options.ascent = 'undefined' !== typeof options.ascent ?
      options.ascent :
      fontHeight - options.descent;

    if(
      (!options.normalize) &&
      fontHeight > (1 < glyphs.length ?
        glyphs.reduce(function(curMin, glyph) {
          return Math.min(curMin, glyph.height);
        }, Infinity) :
        glyphs[0].height
      )
    ) {
      log('The provided icons does not have the same height it could lead' +
        ' to unexpected results. Using the normalize option could' +
        ' solve the problem.');
    }
    // Output the SVG file
    // (find a SAX parser that allows modifying SVG on the fly)
    _this.push('\
<?xml version="1.0" standalone="no"?> \n\
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"' +
  ' "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >\n\
<svg xmlns="http://www.w3.org/2000/svg">\n' + (
  options.metadata ? '<metadata>' + options.metadata + '</metadata>\n' : ''
) + '\
<defs>\n\
  <font id="' + options.fontId + '" horiz-adv-x="' + fontWidth + '">\n\
    <font-face font-family="' + options.fontName + '"\n\
      units-per-em="' + fontHeight + '" ascent="' + options.ascent + '"\n\
      descent="' + options.descent + '"' + (options.fontWeight ? '\n\
      font-weight="' + options.fontWeight + '"' : '') + (options.fontStyle ? '\n\
      font-style="' + options.fontStyle + '"' : '') + ' />\n\
    <missing-glyph horiz-adv-x="0" />\n');
    glyphs.forEach(function(glyph) {
      var ratio = fontHeight / glyph.height;
      var d = '';
      var bounds;
      var pathData;

      if(options.fixedWidth) {
        glyph.width = fontWidth;
      }
      if(options.normalize) {
        glyph.height = fontHeight;
        if(!options.fixedWidth) {
          glyph.width *= ratio;
        }
      }
      glyph.d.forEach(function(cD) {
        d += ' ' + new SVGPathData(cD)
          .toAbs()
          .translate(-glyph.dX, -glyph.dY)
          .scale(
            options.normalize ? ratio : 1,
            options.normalize ? ratio : 1)
          .ySymetry(glyph.height - options.descent)
          .round(options.round)
          .encode();
      });
      if(options.centerHorizontally) {
        // Naive bounds calculation (should draw, then calculate bounds...)
        pathData = new SVGPathData(d);
        bounds = {
          x1: Infinity,
          y1: Infinity,
          x2: 0,
          y2: 0,
        };
        pathData.toAbs().commands.forEach(function(command) {
          bounds.x1 = 'undefined' != typeof command.x && command.x < bounds.x1 ?
            command.x :
            bounds.x1;
          bounds.y1 = 'undefined' != typeof command.y && command.y < bounds.y1 ?
            command.y :
            bounds.y1;
          bounds.x2 = 'undefined' != typeof command.x && command.x > bounds.x2 ?
            command.x :
            bounds.x2;
          bounds.y2 = 'undefined' != typeof command.y && command.y > bounds.y2 ?
            command.y :
            bounds.y2;
        });
        d = pathData
          .translate(((glyph.width - (bounds.x2 - bounds.x1)) / 2) - bounds.x1)
          .round(options.round)
          .encode();
      }
      delete glyph.d;
      delete glyph.running;
      glyph.unicode.forEach(function(unicode, i) {
        _this.push('\
    <glyph glyph-name="' + glyph.name + (0 === i ? '' : '-' + i) + '"\n\
      unicode="' + ucs2.decode(unicode).map(function(point) {
        return '&#x' + point.toString(16).toUpperCase() + ';';
      }).join('') + '"\n\
      horiz-adv-x="' + glyph.width + '" d="' + d + '" />\n');
      });
    });
    _this.push('\
  </font>\n\
</defs>\n\
</svg>\n');
    log('Font created');
    if('function' === (typeof options.callback)) {
      (options.callback)(glyphs);
    }
    svgFontFlushCallback();
  };

}

module.exports = SVGIcons2SVGFontStream;
