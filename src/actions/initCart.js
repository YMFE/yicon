import {
  INIT_CART,
} from '../constants/actionTypes';

export function initCart() {
  return {
    type: INIT_CART,
    cartIcons: JSON.parse(window.localStorage.cartIcons),
  };
}
