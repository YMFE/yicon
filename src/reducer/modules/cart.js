import {
  INIT_CART,
  FETCH_CART_DETAIL,
} from '../../constants/actionTypes';

const initialState = {
  iconsInLocalStorage: [],
  iconsInCart: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CART_DETAIL: {
      return {
        iconsInCart: action.payload.data,
        ...state,
      };
    }
    case INIT_CART: {
      return {
        iconsInCart: action.payload,
        ...state,
      };
    }
    default:
      return state;
  }
};
