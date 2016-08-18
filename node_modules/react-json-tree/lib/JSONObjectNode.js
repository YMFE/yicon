'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

exports['default'] = function (_ref) {
  var props = (0, _objectWithoutProperties3['default'])(_ref, []);

  return _react2['default'].createElement(_JSONNestedNode2['default'], (0, _extends3['default'])({}, props, {
    nodeType: 'Object',
    nodeTypeIndicator: '{}',
    createItemString: createItemString
  }));
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _JSONNestedNode = require('./JSONNestedNode');

var _JSONNestedNode2 = _interopRequireDefault(_JSONNestedNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Returns the "n Items" string for this node, generating and caching it if it hasn't been created yet.
function createItemString(data) {
  var len = (0, _getOwnPropertyNames2.default)(data).length;
  return len + ' ' + (len !== 1 ? 'keys' : 'key');
}

// Configures <JSONNestedNode> to render an Object