import {
  FETCH_SEARCH_RESULT,
} from '../../constants/actionTypes';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SEARCH_RESULT: {
      return action.payload.data || [];
    }
    default:
      return state;
  }
};
