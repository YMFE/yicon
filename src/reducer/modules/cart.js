import {
  INIT_CART,
  ADD_ICON_TO_CART,
  DELETE_ICON_IN_CART,
  FETCH_CART_DETAIL,
} from '../../constants/actionTypes';

const initialState = {
  iconsInLocalStorage: [],
  iconsInCart: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_CART: {
      return {
        ...state,
        iconsInLocalStorage: action.payload,
      };
    }
    case ADD_ICON_TO_CART: {
      return {
        ...state,
        iconsInLocalStorage: action.payload,
      };
    }
    case DELETE_ICON_IN_CART: {
      return {
        ...state,
        iconsInLocalStorage: action.payload,
      };
    }
    case FETCH_CART_DETAIL: {
      return {
        ...state,
        iconsInCart: action.payload.data,
      };
    }
    default:
      return state;
  }
};
