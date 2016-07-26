import {
  FETCH_SEARCH_RESULT,
} from '../../constants/actionTypes';

const initialState = { data: [], totalCount: 0, queryKey: '' };

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SEARCH_RESULT: {
      return action.payload.data || { data: [], totalCount: 0, queryKey: '' };
    }
    default:
      return state;
  }
};
