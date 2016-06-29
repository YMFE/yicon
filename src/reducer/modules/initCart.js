import {
  INIT_CART,
} from '../../constants/actionTypes';

const cartIcons = [];

export default (state = cartIcons, action) => {
  switch (action.type) {
    case INIT_CART: {
      return action.cartIcons;
    }
    default:
      return state;
  }
};
