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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var styles = {
  base: {
    display: 'inline-block',
    marginLeft: 0,
    marginTop: 8,
    'float': 'left',
    transition: '150ms',
    WebkitTransition: '150ms',
    MozTransition: '150ms',
    WebkitTransform: 'rotateZ(-90deg)',
    MozTransform: 'rotateZ(-90deg)',
    transform: 'rotateZ(-90deg)',
    position: 'relative'
  },
  container: {
    display: 'inline-block',
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    paddingLeft: 5,
    cursor: 'pointer'
  },
  containerDouble: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 10,
    paddingLeft: 10
  },
  arrow: {
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTopWidth: 5,
    borderTopStyle: 'solid'
  },
  open: {
    WebkitTransform: 'rotateZ(0deg)',
    MozTransform: 'rotateZ(0deg)',
    transform: 'rotateZ(0deg)'
  },
  inner: {
    position: 'absolute',
    top: 0,
    left: -5
  }
};

var JSONArrow = function (_React$Component) {
  (0, _inherits3.default)(JSONArrow, _React$Component);

  function JSONArrow() {
    (0, _classCallCheck3.default)(this, JSONArrow);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  JSONArrow.prototype.render = function render() {
    var containerStyle = (0, _extends3.default)({}, styles.container);
    var style = (0, _extends3.default)({}, styles.base, styles.arrow);
    var color = {
      borderTopColor: this.props.theme.base0D
    };
    if (this.props.open) {
      style = (0, _extends3.default)({}, style, styles.open);
    }
    if (this.props.double) {
      containerStyle = (0, _extends3.default)({}, containerStyle, styles.containerDouble);
    }
    style = (0, _extends3.default)({}, style, this.props.style);
    return _react2.default.createElement(
      'div',
      { style: containerStyle, onClick: this.props.onClick },
      _react2.default.createElement(
        'div',
        { style: (0, _extends3.default)({}, color, style) },
        this.props.double && _react2.default.createElement('div', { style: (0, _extends3.default)({}, color, styles.inner, styles.arrow) })
      )
    );
  };

  return JSONArrow;
}(_react2.default.Component);

exports['default'] = JSONArrow;