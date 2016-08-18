'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJsonTree = require('react-json-tree');

var _reactJsonTree2 = _interopRequireDefault(_reactJsonTree);

var _LogMonitorEntryAction = require('./LogMonitorEntryAction');

var _LogMonitorEntryAction2 = _interopRequireDefault(_LogMonitorEntryAction);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  entry: {
    display: 'block',
    WebkitUserSelect: 'none'
  },
  tree: {
    paddingLeft: 0
  }
};

var LogMonitorEntry = (function (_Component) {
  _inherits(LogMonitorEntry, _Component);

  function LogMonitorEntry(props) {
    _classCallCheck(this, LogMonitorEntry);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.shouldComponentUpdate = _function2.default;

    _this.handleActionClick = _this.handleActionClick.bind(_this);
    _this.shouldExpandNode = _this.shouldExpandNode.bind(_this);
    return _this;
  }

  LogMonitorEntry.prototype.printState = function printState(state, error) {
    var errorText = error;
    if (!errorText) {
      try {
        return _react2.default.createElement(_reactJsonTree2.default, {
          theme: this.props.theme,
          keyPath: ['state'],
          data: this.props.select(state),
          previousData: typeof this.props.previousState !== 'undefined' ? this.props.select(this.props.previousState) : undefined,
          shouldExpandNode: this.shouldExpandNode,
          style: styles.tree });
      } catch (err) {
        errorText = 'Error selecting state.';
      }
    }

    return _react2.default.createElement(
      'div',
      { style: {
          color: this.props.theme.base08,
          paddingTop: 20,
          paddingLeft: 30,
          paddingRight: 30,
          paddingBottom: 35
        } },
      errorText
    );
  };

  LogMonitorEntry.prototype.handleActionClick = function handleActionClick() {
    var _props = this.props;
    var actionId = _props.actionId;
    var onActionClick = _props.onActionClick;

    if (actionId > 0) {
      onActionClick(actionId);
    }
  };

  LogMonitorEntry.prototype.shouldExpandNode = function shouldExpandNode() {
    return this.props.expandStateRoot;
  };

  LogMonitorEntry.prototype.render = function render() {
    var _props2 = this.props;
    var actionId = _props2.actionId;
    var error = _props2.error;
    var action = _props2.action;
    var state = _props2.state;
    var collapsed = _props2.collapsed;

    var styleEntry = {
      opacity: collapsed ? 0.5 : 1,
      cursor: actionId > 0 ? 'pointer' : 'default'
    };

    return _react2.default.createElement(
      'div',
      { style: {
          textDecoration: collapsed ? 'line-through' : 'none',
          color: this.props.theme.base06
        } },
      _react2.default.createElement(_LogMonitorEntryAction2.default, {
        theme: this.props.theme,
        collapsed: collapsed,
        action: action,
        expandActionRoot: this.props.expandActionRoot,
        onClick: this.handleActionClick,
        style: _extends({}, styles.entry, styleEntry) }),
      !collapsed && _react2.default.createElement(
        'div',
        null,
        this.printState(state, error)
      )
    );
  };

  return LogMonitorEntry;
})(_react.Component);

LogMonitorEntry.propTypes = {
  state: _react.PropTypes.object.isRequired,
  action: _react.PropTypes.object.isRequired,
  actionId: _react.PropTypes.number.isRequired,
  select: _react.PropTypes.func.isRequired,
  error: _react.PropTypes.string,
  onActionClick: _react.PropTypes.func.isRequired,
  collapsed: _react.PropTypes.bool,
  expandActionRoot: _react.PropTypes.bool,
  expandStateRoot: _react.PropTypes.bool
};
exports.default = LogMonitorEntry;