import {
  GET_CART_DES,
} from '../../constants/actionTypes';

const cartIcons = [];

export default (state = cartIcons, action) => {
  switch (action.type) {
    case GET_CART_DES: {
      return action.payload.data;
    }
    default:
      return state;
  }
};
