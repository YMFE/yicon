import {
  INIT_CART,
} from '../../constants/actionTypes';

const cartIconIds = [];

export default (state = cartIconIds, action) => {
  switch (action.type) {
    case INIT_CART: {
      return action.cartIconIds;
    }
    default:
      return state;
  }
};
