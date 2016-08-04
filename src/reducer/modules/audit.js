import {
  FETCH_AUDIT_LIST,
} from '../../constants/actionTypes';

const initialState = {
  list: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUDIT_LIST:
      return {
        list: action.payload.data,
      };
    default:
      return state;
  }
};
