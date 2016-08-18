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

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _JSONArrow = require('./JSONArrow');

var _JSONArrow2 = _interopRequireDefault(_JSONArrow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var STYLES = {
  itemRange: {
    margin: '8px 0 8px 14px',
    cursor: 'pointer'
  }
};

var ItemRange = (_temp = _class = function (_Component) {
  (0, _inherits3.default)(ItemRange, _Component);

  function ItemRange(props) {
    (0, _classCallCheck3.default)(this, ItemRange);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

    _this.shouldComponentUpdate = _function2.default;

    _this.state = { expanded: false };

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  ItemRange.prototype.render = function render() {
    var _props = this.props;
    var theme = _props.theme;
    var styles = _props.styles;
    var from = _props.from;
    var to = _props.to;
    var getChildNodes = _props.getChildNodes;


    return this.state.expanded ? _react2.default.createElement(
      'div',
      { style: (0, _extends3.default)({ color: theme.base0D }, styles.label) },
      getChildNodes(this.props, from, to)
    ) : _react2.default.createElement(
      'div',
      { style: (0, _extends3.default)({ color: theme.base0D }, STYLES.itemRange, styles.label),
        onClick: this.handleClick },
      _react2.default.createElement(_JSONArrow2.default, {
        theme: theme,
        open: false,
        onClick: this.handleClick,
        style: styles.getArrowStyle(false),
        double: true }),
      from + ' ... ' + to
    );
  };

  ItemRange.prototype.handleClick = function handleClick() {
    this.setState({ expanded: !this.state.expanded });
  };

  return ItemRange;
}(_react.Component), _class.propTypes = {}, _temp);
exports['default'] = ItemRange;