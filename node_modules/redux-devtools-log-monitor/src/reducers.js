import { UPDATE_SCROLL_TOP } from './actions';

function initialScrollTop(props, state = 0, action) {
  if (!props.preserveScrollTop) {
    return 0;
  }

  return action.type === UPDATE_SCROLL_TOP ?
    action.scrollTop :
    state;
}

export default function reducer(props, state = {}, action) {
  return {
    initialScrollTop: initialScrollTop(props, state.initialScrollTop, action)
  };
}
