/**
 * core-decorators.js
 * (c) 2016 Jay Phelps and contributors
 * MIT Licensed
 * https://github.com/jayphelps/core-decorators.js
 * @license
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

var _override = require('./override');

exports.override = _interopRequire(_override);

var _deprecate = require('./deprecate');

exports.deprecate = _interopRequire(_deprecate);
exports.deprecated = _interopRequire(_deprecate);

var _suppressWarnings = require('./suppress-warnings');

exports.suppressWarnings = _interopRequire(_suppressWarnings);

var _memoize = require('./memoize');

exports.memoize = _interopRequire(_memoize);

var _autobind = require('./autobind');

exports.autobind = _interopRequire(_autobind);

var _readonly = require('./readonly');

exports.readonly = _interopRequire(_readonly);

var _enumerable = require('./enumerable');

exports.enumerable = _interopRequire(_enumerable);

var _nonenumerable = require('./nonenumerable');

exports.nonenumerable = _interopRequire(_nonenumerable);

var _nonconfigurable = require('./nonconfigurable');

exports.nonconfigurable = _interopRequire(_nonconfigurable);

var _debounce = require('./debounce');

exports.debounce = _interopRequire(_debounce);

var _throttle = require('./throttle');

exports.throttle = _interopRequire(_throttle);

var _decorate = require('./decorate');

exports.decorate = _interopRequire(_decorate);

var _mixin = require('./mixin');

exports.mixin = _interopRequire(_mixin);
exports.mixins = _interopRequire(_mixin);

var _lazyInitialize = require('./lazy-initialize');

exports.lazyInitialize = _interopRequire(_lazyInitialize);

var _time = require('./time');

exports.time = _interopRequire(_time);

var _extendDescriptor = require('./extendDescriptor');

exports.extendDescriptor = _interopRequire(_extendDescriptor);

// Helper to apply decorators to a class without transpiler support

var _applyDecorators = require('./applyDecorators');

exports.applyDecorators = _interopRequire(_applyDecorators);