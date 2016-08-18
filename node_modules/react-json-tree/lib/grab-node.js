'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports['default'] = function (_ref) {
  var getItemString = _ref.getItemString;
  var _ref$initialExpanded = _ref.initialExpanded;
  var initialExpanded = _ref$initialExpanded === undefined ? false : _ref$initialExpanded;
  var keyPath = _ref.keyPath;
  var labelRenderer = _ref.labelRenderer;
  var previousData = _ref.previousData;
  var styles = _ref.styles;
  var theme = _ref.theme;
  var value = _ref.value;
  var valueRenderer = _ref.valueRenderer;
  var isCustomNode = _ref.isCustomNode;
  var rest = (0, _objectWithoutProperties3['default'])(_ref, ['getItemString', 'initialExpanded', 'keyPath', 'labelRenderer', 'previousData', 'styles', 'theme', 'value', 'valueRenderer', 'isCustomNode']);

  var nodeType = isCustomNode(value) ? 'Custom' : (0, _objType2['default'])(value);

  var simpleNodeProps = {
    getItemString: getItemString,
    initialExpanded: initialExpanded,
    key: keyPath[0],
    keyPath: keyPath,
    labelRenderer: labelRenderer,
    nodeType: nodeType,
    previousData: previousData,
    styles: styles,
    theme: theme,
    value: value,
    valueRenderer: valueRenderer
  };

  var nestedNodeProps = (0, _extends3['default'])({}, rest, simpleNodeProps, {
    data: value,
    isCustomNode: isCustomNode
  });

  switch (nodeType) {
    case 'Object':
    case 'Error':
      return _react2['default'].createElement(_JSONObjectNode2['default'], nestedNodeProps);
    case 'Array':
      return _react2['default'].createElement(_JSONArrayNode2['default'], nestedNodeProps);
    case 'Iterable':
      return _react2['default'].createElement(_JSONIterableNode2['default'], nestedNodeProps);
    case 'String':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base0B, valueGetter: function valueGetter(raw) {
          return '"' + raw + '"';
        } }));
    case 'Number':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base09 }));
    case 'Boolean':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base09, valueGetter: function valueGetter(raw) {
          return raw ? 'true' : 'false';
        } }));
    case 'Date':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base0B, valueGetter: function valueGetter(raw) {
          return raw.toISOString();
        } }));
    case 'Null':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base08, valueGetter: function valueGetter() {
          return 'null';
        } }));
    case 'Undefined':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base08, valueGetter: function valueGetter() {
          return 'undefined';
        } }));
    case 'Function':
    case 'Symbol':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base08, valueGetter: function valueGetter(raw) {
          return raw.toString();
        } }));
    case 'Custom':
      return _react2['default'].createElement(_JSONValueNode2['default'], simpleNodeProps);
    default:
      return false;
  }
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objType = require('./obj-type');

var _objType2 = _interopRequireDefault(_objType);

var _JSONObjectNode = require('./JSONObjectNode');

var _JSONObjectNode2 = _interopRequireDefault(_JSONObjectNode);

var _JSONArrayNode = require('./JSONArrayNode');

var _JSONArrayNode2 = _interopRequireDefault(_JSONArrayNode);

var _JSONIterableNode = require('./JSONIterableNode');

var _JSONIterableNode2 = _interopRequireDefault(_JSONIterableNode);

var _JSONValueNode = require('./JSONValueNode');

var _JSONValueNode2 = _interopRequireDefault(_JSONValueNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }