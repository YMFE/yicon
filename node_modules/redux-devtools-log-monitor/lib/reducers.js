'use strict';

exports.__esModule = true;
exports.default = reducer;

var _actions = require('./actions');

function initialScrollTop(props) {
  var state = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var action = arguments[2];

  if (!props.preserveScrollTop) {
    return 0;
  }

  return action.type === _actions.UPDATE_SCROLL_TOP ? action.scrollTop : state;
}

function reducer(props) {
  var state = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var action = arguments[2];

  return {
    initialScrollTop: initialScrollTop(props, state.initialScrollTop, action)
  };
}