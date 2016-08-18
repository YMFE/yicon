'use strict';

exports.__esModule = true;
exports['default'] = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _dec, _class, _class2, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMixin = require('react-mixin');

var _reactMixin2 = _interopRequireDefault(_reactMixin);

var _mixins = require('./mixins');

var _JSONArrow = require('./JSONArrow');

var _JSONArrow2 = _interopRequireDefault(_JSONArrow);

var _getCollectionEntries = require('./getCollectionEntries');

var _getCollectionEntries2 = _interopRequireDefault(_getCollectionEntries);

var _grabNode = require('./grab-node');

var _grabNode2 = _interopRequireDefault(_grabNode);

var _ItemRange = require('./ItemRange');

var _ItemRange2 = _interopRequireDefault(_ItemRange);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Renders nested values (eg. objects, arrays, lists, etc.)
 */

function getChildNodes(props, from, to) {
  var nodeType = props.nodeType;
  var data = props.data;
  var collectionLimit = props.collectionLimit;
  var previousData = props.previousData;
  var circularCache = props.circularCache;
  var keyPath = props.keyPath;
  var postprocessValue = props.postprocessValue;
  var allExpanded = props.allExpanded;

  var childNodes = [];

  (0, _getCollectionEntries2.default)(nodeType, data, collectionLimit, from, to).forEach(function (entry) {
    if (entry.to) {
      childNodes.push(_react2.default.createElement(_ItemRange2.default, (0, _extends3.default)({}, props, {
        key: 'ItemRange' + entry.from + '-' + entry.to,
        from: entry.from,
        to: entry.to,
        getChildNodes: getChildNodes })));
    } else {
      var key = entry.key;
      var value = entry.value;

      var previousDataValue = undefined;
      if (typeof previousData !== 'undefined' && previousData !== null) {
        previousDataValue = previousData[key];
      }
      var isCircular = circularCache.indexOf(value) !== -1;

      var node = (0, _grabNode2.default)((0, _extends3.default)({}, props, {
        keyPath: [key].concat(keyPath),
        previousData: previousDataValue,
        value: postprocessValue(value),
        postprocessValue: postprocessValue,
        collectionLimit: collectionLimit,
        circularCache: [].concat(circularCache, [value]),
        initialExpanded: false,
        allExpanded: isCircular ? false : allExpanded,
        hideRoot: false
      }));

      if (node !== false) {
        childNodes.push(node);
      }
    }
  });

  return childNodes;
}

var STYLES = {
  base: {
    position: 'relative',
    paddingTop: 3,
    paddingBottom: 3,
    marginLeft: 14
  },
  label: {
    margin: 0,
    padding: 0,
    display: 'inline-block',
    cursor: 'pointer'
  },
  span: {
    cursor: 'default'
  },
  spanType: {
    marginLeft: 5,
    marginRight: 5
  }
};

var JSONNestedNode = (_dec = _reactMixin2.default.decorate(_mixins.ExpandedStateHandlerMixin), _dec(_class = (_temp = _class2 = function (_React$Component) {
  (0, _inherits3.default)(JSONNestedNode, _React$Component);

  function JSONNestedNode(props) {
    (0, _classCallCheck3.default)(this, JSONNestedNode);

    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));

    _this.shouldComponentUpdate = _function2.default;

    _this.state = {
      expanded: _this.props.initialExpanded || _this.props.allExpanded,
      createdChildNodes: false
    };
    return _this;
  }

  JSONNestedNode.prototype.render = function render() {
    var _props = this.props;
    var getItemString = _props.getItemString;
    var nodeTypeIndicator = _props.nodeTypeIndicator;
    var nodeType = _props.nodeType;
    var data = _props.data;
    var hideRoot = _props.hideRoot;
    var styles = _props.styles;
    var createItemString = _props.createItemString;
    var theme = _props.theme;
    var collectionLimit = _props.collectionLimit;
    var keyPath = _props.keyPath;
    var labelRenderer = _props.labelRenderer;

    var expanded = this.state.expanded;
    var childListStyle = {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      display: expanded ? 'block' : 'none'
    };
    var spanStyle = (0, _extends3.default)({}, STYLES.span, {
      color: theme.base0B
    });
    var containerStyle = (0, _extends3.default)({}, STYLES.base);

    if (expanded) {
      spanStyle = (0, _extends3.default)({}, spanStyle, {
        color: theme.base03
      });
    }

    var renderedChildren = expanded ? getChildNodes(this.props) : null;

    var itemType = _react2.default.createElement(
      'span',
      { style: STYLES.spanType },
      nodeTypeIndicator
    );
    var renderedItemString = getItemString(nodeType, data, itemType, createItemString(data, collectionLimit));

    return hideRoot ? _react2.default.createElement(
      'div',
      null,
      renderedChildren
    ) : _react2.default.createElement(
      'li',
      { style: containerStyle },
      _react2.default.createElement(_JSONArrow2.default, {
        theme: theme,
        open: expanded,
        onClick: this.handleClick.bind(this),
        style: styles.getArrowStyle(expanded) }),
      _react2.default.createElement(
        'label',
        {
          style: (0, _extends3.default)({}, STYLES.label, {
            color: theme.base0D
          }, styles.getLabelStyle(nodeType, expanded)),
          onClick: this.handleClick.bind(this) },
        labelRenderer.apply(undefined, keyPath),
        ':'
      ),
      _react2.default.createElement(
        'span',
        {
          style: (0, _extends3.default)({}, spanStyle, styles.getItemStringStyle(nodeType, expanded)),
          onClick: this.handleClick.bind(this) },
        renderedItemString
      ),
      _react2.default.createElement(
        'ul',
        { style: (0, _extends3.default)({}, childListStyle, styles.getListStyle(nodeType, expanded)) },
        renderedChildren
      )
    );
  };

  return JSONNestedNode;
}(_react2.default.Component), _class2.defaultProps = {
  data: [],
  initialExpanded: false,
  allExpanded: false,
  circularCache: []
}, _temp)) || _class);
exports['default'] = JSONNestedNode;