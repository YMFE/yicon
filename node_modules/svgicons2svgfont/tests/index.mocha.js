'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var svgicons2svgfont = require('../src/index.js');
var StringDecoder = require('string_decoder').StringDecoder;
var svgiconsdir = require('../src/iconsdir');
var streamtest = require('streamtest');

// Helpers
function generateFontToFile(options, done, fileSuffix, startUnicode, files) {  // eslint-disable-line
  var dest = path.join(__dirname, 'results', options.fontName +
    (fileSuffix || '') + '.svg');
  var svgFontStream;

  options.log = function() {};
  svgFontStream = svgicons2svgfont(options);

  svgFontStream.pipe(fs.createWriteStream(dest)).on('finish', function() {
    assert.equal(
      fs.readFileSync(
        path.join(__dirname, 'expected',
          options.fontName + (fileSuffix || '') + '.svg'),
          { encoding: 'utf8' }
        ),
      fs.readFileSync(dest, { encoding: 'utf8' })
    );
    done();
  });

  svgiconsdir(
    files || path.join(__dirname, 'fixtures', options.fontName), {
      startUnicode: startUnicode || 0xE001,
    }
  )
    .pipe(svgFontStream);
}

function generateFontToMemory(options, done, files, startUnicode) {
  var content = '';
  var decoder = new StringDecoder('utf8');
  var svgFontStream;

  options.log = function() {};
  svgFontStream = svgicons2svgfont(options);

  svgFontStream.on('data', function(chunk) {
    content += decoder.write(chunk);
  });

  svgFontStream.on('finish', function() {
    assert.equal(
      fs.readFileSync(
        path.join(__dirname, 'expected', options.fontName + '.svg'),
        { encoding: 'utf8' }
      ),
      content
    );
    done();
  });

  svgiconsdir(files || path.join(__dirname, 'fixtures', options.fontName), {
    startUnicode: startUnicode || 0xE001,
  })
    .pipe(svgFontStream);

}

// Tests
describe('Generating fonts to files', function() {

  it('should work for simple SVG', function(done) {
    generateFontToFile({
      fontName: 'originalicons',
    }, done);
  });

  it('should work for simple fixedWidth and normalize option', function(done) {
    generateFontToFile({
      fontName: 'originalicons',
      fixedWidth: true,
      normalize: true,
    }, done, 'n');
  });

  it('should work for simple SVG', function(done) {
    generateFontToFile({
      fontName: 'cleanicons',
    }, done);
  });

  it('should work for simple SVG and custom ascent', function(done) {
    generateFontToFile({
      fontName: 'cleanicons',
      ascent: 100,
    }, done, '-ascent');
  });

  it('should work for simple SVG and custom properties', function(done) {
    generateFontToFile({
      fontName: 'cleanicons',
      fontStyle: 'italic',
      fontWeight: 'bold',
    }, done, '-stw');
  });

  it('should work for codepoint mapped SVG icons', function(done) {
    generateFontToFile({
      fontName: 'prefixedicons',
      callback: function() {},
    }, done);
  });

  it('should work with multipath SVG icons', function(done) {
    generateFontToFile({
      fontName: 'multipathicons',
    }, done);
  });

  it('should work with simple shapes SVG icons', function(done) {
    generateFontToFile({
      fontName: 'shapeicons',
    }, done);
  });

  it('should work with variable height icons', function(done) {
    generateFontToFile({
      fontName: 'variableheighticons',
    }, done);
  });

  it('should work with variable height icons and the normalize option', function(done) {
    generateFontToFile({
      fontName: 'variableheighticons',
      normalize: true,
    }, done, 'n');
  });

  it('should work with variable width icons', function(done) {
    generateFontToFile({
      fontName: 'variablewidthicons',
    }, done);
  });

  it('should work with centered variable width icons and the fixed width option', function(done) {
    generateFontToFile({
      fontName: 'variablewidthicons',
      fixedWidth: true,
      centerHorizontally: true,
    }, done, 'n');
  });

  it('should work with a font id', function(done) {
    generateFontToFile({
      fontName: 'variablewidthicons',
      fixedWidth: true,
      centerHorizontally: true,
      fontId: 'plop',
    }, done, 'id');
  });

  it('should not display hidden pathes', function(done) {
    generateFontToFile({
      fontName: 'hiddenpathesicons',
    }, done);
  });

  it('should work with real world icons', function(done) {
    generateFontToFile({
      fontName: 'realicons',
    }, done);
  });

  it('should work with rendering test SVG icons', function(done) {
    generateFontToFile({
      fontName: 'rendricons',
    }, done);
  });

  it('should work with a single SVG icon', function(done) {
    generateFontToFile({
      fontName: 'singleicon',
    }, done);
  });

  it('should work with transformed SVG icons', function(done) {
    generateFontToFile({
      fontName: 'transformedicons',
    }, done);
  });

  it('should work when horizontally centering SVG icons', function(done) {
    generateFontToFile({
      fontName: 'tocentericons',
      centerHorizontally: true,
    }, done);
  });

  it('should work with a icons with path with fill none', function(done) {
    generateFontToFile({
      fontName: 'pathfillnone',
    }, done);
  });

  it('should work with shapes with rounded corners', function(done) {
    generateFontToFile({
      fontName: 'roundedcorners',
    }, done);
  });

  it('should work with a lot of icons', function(done) {
    generateFontToFile({
      fontName: 'lotoficons',
    }, done, '', 0, [
      'tests/fixtures/cleanicons/account.svg',
      'tests/fixtures/cleanicons/arrow-down.svg',
      'tests/fixtures/cleanicons/arrow-left.svg',
      'tests/fixtures/cleanicons/arrow-right.svg',
      'tests/fixtures/cleanicons/arrow-up.svg',
      'tests/fixtures/cleanicons/basket.svg',
      'tests/fixtures/cleanicons/close.svg',
      'tests/fixtures/cleanicons/minus.svg',
      'tests/fixtures/cleanicons/plus.svg',
      'tests/fixtures/cleanicons/search.svg',
      'tests/fixtures/hiddenpathesicons/sound--off.svg',
      'tests/fixtures/hiddenpathesicons/sound--on.svg',
      'tests/fixtures/multipathicons/kikoolol.svg',
      'tests/fixtures/originalicons/mute.svg',
      'tests/fixtures/originalicons/sound.svg',
      'tests/fixtures/originalicons/speaker.svg',
      'tests/fixtures/realicons/diegoliv.svg',
      'tests/fixtures/realicons/hannesjohansson.svg',
      'tests/fixtures/realicons/roelvanhitum.svg',
      'tests/fixtures/realicons/safety-icon.svg',
      'tests/fixtures/realicons/sb-icon.svg',
      'tests/fixtures/realicons/settings-icon.svg',
      'tests/fixtures/realicons/track-icon.svg',
      'tests/fixtures/realicons/web-icon.svg',
      'tests/fixtures/roundedcorners/roundedrect.svg',
      'tests/fixtures/shapeicons/circle.svg',
      'tests/fixtures/shapeicons/ellipse.svg',
      'tests/fixtures/shapeicons/lines.svg',
      'tests/fixtures/shapeicons/polygon.svg',
      'tests/fixtures/shapeicons/polyline.svg',
      'tests/fixtures/shapeicons/rect.svg',
      'tests/fixtures/tocentericons/bottomleft.svg',
      'tests/fixtures/tocentericons/center.svg',
      'tests/fixtures/tocentericons/topright.svg',
    ]);
  });

});

describe('Generating fonts to memory', function() {

  it('should work for simple SVG', function(done) {
    generateFontToMemory({
      fontName: 'originalicons',
    }, done);
  });

  it('should work for simple SVG', function(done) {
    generateFontToMemory({
      fontName: 'cleanicons',
    }, done);
  });

  it('should work for codepoint mapped SVG icons', function(done) {
    generateFontToMemory({
      fontName: 'prefixedicons',
    }, done);
  });

  it('should work with multipath SVG icons', function(done) {
    generateFontToMemory({
      fontName: 'multipathicons',
    }, done);
  });

  it('should work with simple shapes SVG icons', function(done) {
    generateFontToMemory({
      fontName: 'shapeicons',
    }, done);
  });

});

describe('Using options', function() {

  it('should work with fixedWidth option set to true', function(done) {
    generateFontToFile({
      fontName: 'originalicons',
      fixedWidth: true,
    }, done, '2');
  });

  it('should work with custom fontHeight option', function(done) {
    generateFontToFile({
      fontName: 'originalicons',
      fontHeight: 800,
    }, done, '3');
  });

  it('should work with custom descent option', function(done) {
    generateFontToFile({
      fontName: 'originalicons',
      descent: 200,
    }, done, '4');
  });

  it('should work with fixedWidth set to true and with custom fontHeight option',
    function(done) {
      generateFontToFile({
        fontName: 'originalicons',
        fontHeight: 800,
        fixedWidth: true,
      }, done, '5');
    }
  );

  it('should work with fixedWidth and centerHorizontally set to true and with' +
    ' custom fontHeight option', function(done) {
    generateFontToFile({
      fontName: 'originalicons',
      fontHeight: 800,
      fixedWidth: true,
      centerHorizontally: true,
    }, done, '6');
  });

  it('should work with fixedWidth, normalize and centerHorizontally set to' +
    ' true and with custom fontHeight option', function(done) {
    generateFontToFile({
      fontName: 'originalicons',
      fontHeight: 800,
      normalize: true,
      fixedWidth: true,
      centerHorizontally: true,
    }, done, '7');
  });

  it('should work with nested icons', function(done) {
    generateFontToFile({
      fontName: 'nestedicons',
    }, done, '', 0xEA01);
  });

});

describe('Passing code points', function() {

  it('should work with multiple unicode values for a single icon', function(done) {
    var svgIconStream = fs.createReadStream(
      path.join(__dirname, 'fixtures', 'cleanicons', 'account.svg')
    );

    var svgFontStream = svgicons2svgfont();
    var content = '';
    var decoder = new StringDecoder('utf8');

    svgIconStream.metadata = {
      name: 'account',
      unicode: ['\uE001', '\uE002'],
    };

    svgFontStream.on('data', function(chunk) {
      content += decoder.write(chunk);
    });

    svgFontStream.on('finish', function() {
      assert.equal(
        fs.readFileSync(path.join(__dirname, 'expected', 'cleanicons-multi.svg'),
          { encoding: 'utf8' }),
        content
      );
      done();
    });
    svgFontStream.write(svgIconStream);
    svgFontStream.end();
  });

  it('should work with ligatures', function(done) {
    var svgIconStream = fs.createReadStream(
      path.join(__dirname, 'fixtures', 'cleanicons', 'account.svg')
    );
    var svgFontStream = svgicons2svgfont();
    var content = '';
    var decoder = new StringDecoder('utf8');

    svgIconStream.metadata = {
      name: 'account',
      unicode: ['\uE001\uE002'],
    };

    svgFontStream.on('data', function(chunk) {
      content += decoder.write(chunk);
    });

    svgFontStream.on('finish', function() {
      assert.equal(
        fs.readFileSync(path.join(__dirname, 'expected', 'cleanicons-lig.svg'),
          { encoding: 'utf8' }),
        content
      );
      done();
    });
    svgFontStream.write(svgIconStream);
    svgFontStream.end();
  });


  it('should work with high code points', function(done) {
    var ucs2 = require('punycode').ucs2;

    var svgIconStream = fs.createReadStream(
      path.join(__dirname, 'fixtures', 'cleanicons', 'account.svg')
    );
    var svgFontStream = svgicons2svgfont();
    var content = '';
    var decoder = new StringDecoder('utf8');

    svgIconStream.metadata = {
      name: 'account',
      unicode: [ucs2.encode([0x1F63A])],
    };

    svgFontStream.on('data', function(chunk) {
      content += decoder.write(chunk);
    });

    svgFontStream.on('finish', function() {
      assert.equal(
        fs.readFileSync(path.join(__dirname, 'expected', 'cleanicons-high.svg'),
          { encoding: 'utf8' }),
        content
      );
      done();
    });
    svgFontStream.write(svgIconStream);
    svgFontStream.end();
  });
});

describe('Providing bad glyphs', function() {

  it('should fail when not providing glyph name', function(done) {
    var svgIconStream = fs.createReadStream(
      path.join(__dirname, 'fixtures', 'cleanicons', 'account.svg')
    );

    svgIconStream.metadata = {
      unicode: '\uE001',
    };
    svgicons2svgfont().on('error', function(err) {
      assert.equal(err instanceof Error, true);
      assert.equal(err.message, 'Please provide a name for the glyph at index 0');
      done();
    }).write(svgIconStream);
  });

  it('should fail when not providing codepoints', function(done) {
    var svgIconStream = fs.createReadStream(
      path.join(__dirname, 'fixtures', 'cleanicons', 'account.svg')
    );

    svgIconStream.metadata = {
      name: 'test',
    };
    svgicons2svgfont().on('error', function(err) {
      assert.equal(err instanceof Error, true);
      assert.equal(err.message, 'Please provide a codepoint for the glyph "test"');
      done();
    }).write(svgIconStream);
  });

  it('should fail when providing unicode value with duplicates', function(done) {
    var svgIconStream = fs.createReadStream(
      path.join(__dirname, 'fixtures', 'cleanicons', 'account.svg')
    );

    svgIconStream.metadata = {
      name: 'test',
      unicode: ['\uE002', '\uE002'],
    };
    svgicons2svgfont().on('error', function(err) {
      assert.equal(err instanceof Error, true);
      assert.equal(err.message, 'Given codepoints for the glyph "test" contain duplicates.');
      done();
    }).write(svgIconStream);
  });

  it('should fail when providing the same codepoint twice', function(done) {
    var svgIconStream = fs.createReadStream(
      path.join(__dirname, 'fixtures', 'cleanicons', 'account.svg')
    );
    var svgIconStream2 = fs.createReadStream(
      path.join(__dirname, 'fixtures', 'cleanicons', 'account.svg')
    );
    var svgFontStream = svgicons2svgfont();

    svgIconStream.metadata = {
      name: 'test',
      unicode: '\uE002',
    };
    svgIconStream2.metadata = {
      name: 'test2',
      unicode: '\uE002',
    };
    svgFontStream.on('error', function(err) {
      assert.equal(err instanceof Error, true);
      assert.equal(err.message, 'The glyph "test2" codepoint seems to be used already elsewhere.');
      done();
    });
    svgFontStream.write(svgIconStream);
    svgFontStream.write(svgIconStream2);
  });

  it('should fail when providing the same name twice', function(done) {
    var svgIconStream = fs.createReadStream(
      path.join(__dirname, 'fixtures', 'cleanicons', 'account.svg')
    );
    var svgIconStream2 = fs.createReadStream(
      path.join(__dirname, 'fixtures', 'cleanicons', 'account.svg')
    );
    var svgFontStream = svgicons2svgfont();

    svgIconStream.metadata = {
      name: 'test',
      unicode: '\uE001',
    };
    svgIconStream2.metadata = {
      name: 'test',
      unicode: '\uE002',
    };
    svgFontStream.on('error', function(err) {
      assert.equal(err instanceof Error, true);
      assert.equal(err.message, 'The glyph name "test" must be unique.');
      done();
    });
    svgFontStream.write(svgIconStream);
    svgFontStream.write(svgIconStream2);
  });

  it('should fail when providing bad pathdata', function(done) {
    var svgIconStream = fs.createReadStream(
      path.join(__dirname, 'fixtures', 'badicons', 'pathdata.svg')
    );

    svgIconStream.metadata = {
      name: 'test',
      unicode: ['\uE002'],
    };
    svgicons2svgfont().on('error', function(err) {
      assert.equal(err instanceof Error, true);
      assert.equal(err.message, 'Got an error parsing the glyph "test":' +
        ' Expected a flag, got "120" at index "23".');
      done();
    }).on('end', function() {
      done();
    }).write(svgIconStream);
  });

  it('should fail when providing bad XML', function(done) {
    var svgIconStream = streamtest.v2.fromChunks(['bad', 'xml']);

    svgIconStream.metadata = {
      name: 'test',
      unicode: ['\uE002'],
    };
    svgicons2svgfont().on('error', function(err) {
      assert.equal(err instanceof Error, true);
      assert.equal(err.message, 'Non-whitespace before first tag.\nLine: 0\nColumn: 1\nChar: b');
      done();
    }).write(svgIconStream);
  });

});
