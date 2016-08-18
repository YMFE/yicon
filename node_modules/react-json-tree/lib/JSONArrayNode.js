'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports['default'] = JSONArrayNode;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _JSONNestedNode = require('./JSONNestedNode');

var _JSONNestedNode2 = _interopRequireDefault(_JSONNestedNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Returns the "n Items" string for this node, generating and caching it if it hasn't been created yet.
function createItemString(data) {
  return data.length + ' ' + (data.length !== 1 ? 'items' : 'item');
}

// Configures <JSONNestedNode> to render an Array
function JSONArrayNode(_ref) {
  var props = (0, _objectWithoutProperties3.default)(_ref, []);

  return _react2.default.createElement(_JSONNestedNode2.default, (0, _extends3.default)({}, props, {
    nodeType: 'Array',
    nodeTypeIndicator: '[]',
    createItemString: createItemString
  }));
}