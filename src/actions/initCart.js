import {
  INIT_CART,
} from '../constants/actionTypes';

export function initCart() {
  return {
    type: INIT_CART,
    cartIconIds: JSON.parse(window.localStorage.cartIconIds),
  };
}
