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
        ...state,
        iconsInCart: action.payload.data,
      };
    }
    case INIT_CART: {
      return {
        ...state,
        iconsInLocalStorage: action.payload,
      };
    }
    default:
      return state;
  }
};
