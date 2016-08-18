'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = deprecate;

var _privateUtils = require('./private/utils');

var DEFAULT_MSG = 'This function will be removed in future versions.';

function handleDescriptor(target, key, descriptor, _ref) {
  var _ref2 = _slicedToArray(_ref, 2);

  var _ref2$0 = _ref2[0];
  var msg = _ref2$0 === undefined ? DEFAULT_MSG : _ref2$0;
  var _ref2$1 = _ref2[1];
  var options = _ref2$1 === undefined ? {} : _ref2$1;

  if (typeof descriptor.value !== 'function') {
    throw new SyntaxError('Only functions can be marked as deprecated');
  }

  var methodSignature = target.constructor.name + '#' + key;

  if (options.url) {
    msg += '\n\n    See ' + options.url + ' for more details.\n\n';
  }

  return _extends({}, descriptor, {
    value: function deprecationWrapper() {
      console.warn('DEPRECATION ' + methodSignature + ': ' + msg);
      return descriptor.value.apply(this, arguments);
    }
  });
}

function deprecate() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _privateUtils.decorate)(handleDescriptor, args);
}

module.exports = exports['default'];