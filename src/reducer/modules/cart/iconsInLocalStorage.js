import {
  INIT_CART,
  ADD_ICON_TO_CART,
  DELETE_ICON_IN_CART,
} from '../../../constants/actionTypes';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_CART: {
      return action.payload;
    }
    case ADD_ICON_TO_CART: {
      return [
        ...state,
        action.payload,
      ];
    }
    case DELETE_ICON_IN_CART: {
      return state.filter((iconId) => (iconId !== action.payload));
    }
    default:
      return state;
  }
};
