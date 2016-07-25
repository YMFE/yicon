import {
  FETCH_SEARCH_RESULT,
} from '../../constants/actionTypes';

const initialState = {
  key: '',
  result: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SEARCH_RESULT: {
      window.location.pathname = `/search?key=${action.key}`;
      return {
        ...state,
        result: action.payload.data.data || [],
        key: action.key,
      };
    }
    default:
      return state;
  }
};
