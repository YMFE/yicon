'use strict';

exports.__esModule = true;
exports['default'] = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp; // ES6 + inline style port of JSONViewer https://bitbucket.org/davevedder/react-json-viewer/
// all credits and original code to the author
// Dave Vedder <veddermatic@gmail.com> http://www.eskimospy.com/
// port by Daniele Zannotti http://www.github.com/dzannotti <dzannotti@me.com>

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _grabNode = require('./grab-node');

var _grabNode2 = _interopRequireDefault(_grabNode);

var _solarized = require('./themes/solarized');

var _solarized2 = _interopRequireDefault(_solarized);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var styles = {
  tree: {
    border: 0,
    padding: 0,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 2,
    marginRight: 0,
    fontSize: '0.90em',
    listStyle: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none'
  }
};

var getEmptyStyle = function getEmptyStyle() {
  return {};
};
var identity = function identity(value) {
  return value;
};

var JSONTree = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(JSONTree, _React$Component);

  function JSONTree(props) {
    (0, _classCallCheck3.default)(this, JSONTree);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));
  }

  JSONTree.prototype.render = function render() {
    var getStyles = {
      getArrowStyle: this.props.getArrowStyle,
      getListStyle: this.props.getListStyle,
      getItemStringStyle: this.props.getItemStringStyle,
      getLabelStyle: this.props.getLabelStyle,
      getValueStyle: this.props.getValueStyle
    };

    var _props = this.props;
    var value = _props.data;
    var initialExpanded = _props.expandRoot;
    var allExpanded = _props.expandAll;
    var style = _props.style;
    var keyPath = _props.keyPath;
    var postprocessValue = _props.postprocessValue;
    var hideRoot = _props.hideRoot;
    var rest = (0, _objectWithoutProperties3.default)(_props, ['data', 'expandRoot', 'expandAll', 'style', 'keyPath', 'postprocessValue', 'hideRoot']);


    var nodeToRender = undefined;

    nodeToRender = (0, _grabNode2.default)((0, _extends3.default)({
      initialExpanded: initialExpanded,
      allExpanded: allExpanded,
      keyPath: hideRoot ? [] : keyPath,
      styles: getStyles,
      value: postprocessValue(value),
      postprocessValue: postprocessValue,
      hideRoot: hideRoot
    }, rest));

    return _react2.default.createElement(
      'ul',
      { style: (0, _extends3.default)({}, styles.tree, style) },
      nodeToRender
    );
  };

  return JSONTree;
}(_react2.default.Component), _class.propTypes = {
  data: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.object]).isRequired,
  hideRoot: _react2.default.PropTypes.bool
}, _class.defaultProps = {
  expandRoot: true,
  expandAll: false,
  hideRoot: false,
  keyPath: ['root'],
  theme: _solarized2.default,
  getArrowStyle: getEmptyStyle,
  getListStyle: getEmptyStyle,
  getItemStringStyle: getEmptyStyle,
  getLabelStyle: getEmptyStyle,
  getValueStyle: getEmptyStyle,
  getItemString: function getItemString(type, data, itemType, itemString) {
    return _react2.default.createElement(
      'span',
      null,
      itemType,
      ' ',
      itemString
    );
  },
  labelRenderer: identity,
  valueRenderer: identity,
  postprocessValue: identity,
  isCustomNode: function isCustomNode() {
    return false;
  },
  collectionLimit: 50
}, _temp);
exports['default'] = JSONTree;