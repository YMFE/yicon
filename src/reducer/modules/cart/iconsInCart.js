import {
  FETCH_CART_DETAIL,
} from '../../../constants/actionTypes';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CART_DETAIL: {
      return action.payload.data;
    }
    default:
      return state;
  }
};
