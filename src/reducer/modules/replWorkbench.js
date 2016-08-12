import {
  FETCH_CURR_ICON,
  FETCH_REPLACE_ICON,
  REPL_UPDATE_ICON,
} from '../../constants/actionTypes';

const initialState = {
  currIcon: {},
  repIcon: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REPLACE_ICON: {
      return {
        ...state,
        repIcon: action.payload.data,
      };
    }
    case FETCH_CURR_ICON: {
      return {
        ...state,
        currIcon: action.payload.data,
      };
    }
    case REPL_UPDATE_ICON: {
      return {
        ...state,
        currIcon: action.payload,
      };
    }
    default:
      return state;
  }
};
