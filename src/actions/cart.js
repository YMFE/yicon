import isonFetch from 'isom-fetch';
import {
  INIT_CART,
  FETCH_CART_DETAIL,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });

export function getCartIcons(iconIds) {
  return {
    type: FETCH_CART_DETAIL,
    payload: fetch.post('/icons', iconIds),
  };
}

export function initCart() {
  if (!localStorage.cartIconIds) {
    localStorage.cartIconIds = '[]';
  }
  return {
    type: INIT_CART,
    payload: JSON.parse(localStorage.cartIconIds),
  };
}
