'use strict';

exports.__esModule = true;
exports['default'] = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class, _class2, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMixin = require('react-mixin');

var _reactMixin2 = _interopRequireDefault(_reactMixin);

var _mixins = require('./mixins');

var _hexToRgb = require('./utils/hexToRgb');

var _hexToRgb2 = _interopRequireDefault(_hexToRgb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Renders simple values (eg. strings, numbers, booleans, etc)
 */

var styles = {
  base: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 0,
    marginLeft: 14,
    WebkitUserSelect: 'text',
    MozUserSelect: 'text'
  },
  label: {
    display: 'inline-block',
    marginRight: 5
  }
};

var JSONValueNode = (_dec = _reactMixin2.default.decorate(_mixins.SquashClickEventMixin), _dec(_class = (_temp = _class2 = function (_React$Component) {
  (0, _inherits3.default)(JSONValueNode, _React$Component);

  function JSONValueNode() {
    (0, _classCallCheck3.default)(this, JSONValueNode);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  JSONValueNode.prototype.render = function render() {
    var _props;

    var backgroundColor = 'transparent';
    if (this.props.previousValue !== this.props.value) {
      var bgColor = (0, _hexToRgb2.default)(this.props.theme.base06);
      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
    }

    return _react2.default.createElement(
      'li',
      { style: (0, _extends3.default)({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
      _react2.default.createElement(
        'label',
        { style: (0, _extends3.default)({}, styles.label, {
            color: this.props.theme.base0D
          }, this.props.styles.getLabelStyle(this.props.nodeType, true)) },
        (_props = this.props).labelRenderer.apply(_props, this.props.keyPath),
        ':'
      ),
      _react2.default.createElement(
        'span',
        { style: (0, _extends3.default)({
            color: this.props.valueColor
          }, this.props.styles.getValueStyle(this.props.nodeType, true)) },
        this.props.valueRenderer(this.props.valueGetter(this.props.value), this.props.value)
      )
    );
  };

  return JSONValueNode;
}(_react2.default.Component), _class2.defaultProps = {
  valueGetter: function valueGetter(value) {
    return value;
  }
}, _temp)) || _class);
exports['default'] = JSONValueNode;