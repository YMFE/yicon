'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = suppressWarnings;

var _privateUtils = require('./private/utils');

function suppressedWarningNoop() {
  // Warnings are currently suppressed via @suppressWarnings
}

function applyWithoutWarnings(context, fn, args) {
  var nativeWarn = console.warn;
  console.warn = suppressedWarningNoop;
  var ret = fn.apply(context, args);
  console.warn = nativeWarn;
  return ret;
}

function handleDescriptor(target, key, descriptor) {
  return _extends({}, descriptor, {
    value: function suppressWarningsWrapper() {
      return applyWithoutWarnings(this, descriptor.value, arguments);
    }
  });
}

function suppressWarnings() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _privateUtils.decorate)(handleDescriptor, args);
}

module.exports = exports['default'];