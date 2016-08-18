# svgicons2svgfont
> svgicons2svgfont is a simple tool to merge multiple icons to an SVG font.

[![NPM version](https://badge.fury.io/js/svgicons2svgfont.svg)](https://npmjs.org/package/svgicons2svgfont) [![Build status](https://secure.travis-ci.org/nfroidure/svgicons2svgfont.png)](https://travis-ci.org/nfroidure/svgicons2svgfont) [![Dependency Status](https://david-dm.org/nfroidure/svgicons2svgfont.svg)](https://david-dm.org/nfroidure/svgicons2svgfont) [![devDependency Status](https://david-dm.org/nfroidure/svgicons2svgfont/dev-status.svg)](https://david-dm.org/nfroidure/svgicons2svgfont#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/nfroidure/svgicons2svgfont/badge.svg?branch=master)](https://coveralls.io/r/nfroidure/svgicons2svgfont?branch=master) [![Code Climate](https://codeclimate.com/github/nfroidure/svgicons2svgfont.svg)](https://codeclimate.com/github/nfroidure/svgicons2svgfont)

'rect', 'line', 'circle', 'ellipsis', 'polyline' and 'polygon' shapes will be
 converted to pathes. Multiple pathes will be merged.

Transform attributes support is currenly experimental,
 [report issues if any](https://github.com/nfroidure/svgicons2svgfont/issues/6).

You can test this library with the
 [frontend generator](http://nfroidure.github.io/svgiconfont/).

You may want to convert fonts to icons, if so use
 [svgfont2svgicons](https://github.com/nfroidure/svgifont2svgicons).

## Usage

### In your scripts
```js
var svgicons2svgfont = require('svgicons2svgfont');
var fs = require('fs');
var fontStream = svgicons2svgfont({
  fontName: 'hello'
});

// Setting the font destination
fontStream.pipe(fs.createWriteStream('fonts/hello.svg'))
  .on('finish',function() {
    console.log('Font successfully created!')
  })
  .on('error',function(err) {
    console.log(err);
  });

// Writing glyphs
var glyph1 = fs.createReadStream('icons/icon1.svg');
glyph1.metadata = {
  unicode: ['\uE001\uE002'],
  name: 'icon1'
};
fontStream.write(glyph);
// Multiple unicode values are possible
var glyph2 = fs.createReadStream('icons/icon1.svg');
glyph2.metadata = {
  unicode: ['\uE002', '\uEA02'],
  name: 'icon2'
};
fontStream.write(glyph2);
// Either ligatures are available
var glyph3 = fs.createReadStream('icons/icon1.svg');
glyph3.metadata = {
  unicode: ['\uE001\uE002'],
  name: 'icon1-icon2'
};
fontStream.write(glyph3);

// Do not forget to end the stream
fontStream.end();
```

## CLI interface
All options are available except the `log` one by using this pattern:
 `--{LOWER_CASE(optionName)}={optionValue}`.
```sh
svgicons2svgfont --fontname=hello -o font/destination/file.svg icons/directory/*.svg
```
Note that you won't be able to customize icon names or icons unicodes by
 passing options but by using the following convention to name your icons files:
 `${icon.unicode}-${icon.name}.svg` where `icon.unicode` is a comma separated
 list of unicode strings (ex: 'uEA01,uE001,uE001uE002', note that the last
 string is in fact a ligature).

There is a few more options for the CLI interface, you can list all of them:
```js
svgicons2svgfont --help
#  Usage: svgicons2svgfont [options] <icons ...>
#
#  Options:
#
#    -h, --help                  output usage information
#    -V, --version               output the version number
#    -v, --verbose               tell me everything!
#    -o, --output [/dev/stdout]  Output file.
#    -f, --fontname [value]      the font family name you want [iconfont].
#    -i, --fontId [value]        The font id you want [fontname]
#    -st, --style [value]        the font style you want [iconfont].
#    -we, --weight [value]       the font weight you want [iconfont].
#    -w, --fixedWidth            creates a monospace font of the width of the largest input icon.
#    -c, --centerhorizontally    calculate the bounds of a glyph and center it horizontally.
#    -n, --normalize             normalize icons by scaling them to the height of the highest icon.
#    -h, --height [value]        the outputted font height [MAX(icons.height)].
#    -r, --round [value]         setup the SVG path rounding [10e12].
#    -d, --descent [value]       the font descent [0].
#    -a, --ascent [value]        the font ascent [height - descent].
#    -s, --startunicode [value]  the start unicode codepoint for unprefixed files [0xEA01].
#    -a, --appendunicode         prefix files with their automatically allocated unicode codepoint.
#    -m, --metadata              content of the metadata tag.
```

## API

### svgicons2svgfont(options)

#### options.fontName
Type: `String`
Default value: `'iconfont'`

The font family name you want.

#### options.fontId
Type: `String`
Default value: the options.fontName value

The font id you want.

#### options.fontStyle
Type: `String`
Default value: `''`

The font style you want.

#### options.fontWeight
Type: `String`
Default value: `''`

The font weight you want.

#### options.fixedWidth
Type: `Boolean`
Default value: `false`

Creates a monospace font of the width of the largest input icon.

#### options.centerHorizontally
Type: `Boolean`
Default value: `false`

Calculate the bounds of a glyph and center it horizontally.

**Warning:** The bounds calculation is currently a naive implementation that
 may not work for some icons. We need to create a svg-pathdata-draw module on
 top of svg-pathdata to get the real bounds of the icon. It's on the bottom
 of my to do, but feel free to work on it. Discuss it in the
 [related issue](https://github.com/nfroidure/svgicons2svgfont/issues/18).

#### options.normalize
Type: `Boolean`
Default value: `false`

Normalize icons by scaling them to the height of the highest icon.

#### options.fontHeight
Type: `Number`
Default value: `MAX(icons.height)`
The outputted font height  (defaults to the height of the highest input icon).

#### options.round
Type: `Number`
Default value: `10e12`
Setup SVG path rounding.

#### options.descent
Type: `Number`
Default value: `0`

The font descent. It is usefull to fix the font baseline yourself.

**Warning:**  The descent is a positive value!

#### options.ascent
Type: `Number`
Default value: `fontHeight - descent`

The font ascent. Use this options only if you know what you're doing. A suitable
 value for this is computed for you.

#### options.metadata
Type: `String`
Default value: `undefined`

The font [metadata](http://www.w3.org/TR/SVG/metadata.html). You can set any
 character data in but it is the be suited place for a copyright mention.

#### options.log
Type: `Function`
Default value: `console.log`

Allows you to provide your own logging function. Set to `function(){}` to
 impeach logging.

## Build systems

### Grunt plugins

[grunt-svgicons2svgfont](https://github.com/nfroidure/grunt-svgicons2svgfont)
 and [grunt-webfont](https://github.com/sapegin/grunt-webfont).

### Gulp plugins

Try [gulp-iconfont](https://github.com/nfroidure/gulp-iconfont) and
  [gulp-svgicons2svgfont](https://github.com/nfroidure/gulp-svgicons2svgfont).

### Stylus plugin

Use [stylus-iconfont](https://www.npmjs.org/package/stylus-iconfont).

### Mimosa plugin

Use [mimosa-svgs-to-iconfonts](https://www.npmjs.org/package/mimosa-svgs-to-iconfonts).

## CLI alternatives

You can combine this plugin's CLI interface with
 [svg2ttf](https://www.npmjs.com/package/),
 [ttf2eot](https://www.npmjs.com/package/),
 [ttf2woff](https://www.npmjs.com/package/)
 and [ttf2woff2](https://www.npmjs.com/package/).
You can also use [webfonts-generator](https://www.npmjs.com/package/webfonts-generator).

## Stats

[![NPM](https://nodei.co/npm/svgicons2svgfont.png?downloads=true&stars=true)](https://nodei.co/npm/svgicon2svgfont/)
[![NPM](https://nodei.co/npm-dl/svgicons2svgfont.png)](https://nodei.co/npm/svgicon2svgfont/)

## Contributing
Feel free to push your code if you agree with publishing under the MIT license.
