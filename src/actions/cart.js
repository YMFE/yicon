import isonFetch from 'isom-fetch';
import {
  INIT_CART,
  FETCH_CART_DETAIL,
  ADD_ICON_TO_CART,
  DELETE_ICON_IN_CART,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });
function addToLocalStorage(id) {
  if (!localStorage.cartIconIds) {
    localStorage.cartIconIds = JSON.stringify([]);
  }
  localStorage.cartIconIds = JSON.stringify(JSON.parse(localStorage.cartIconIds).concat([id]));
  return id;
}
function deleteInLocalStorage(id) {
  const icons = JSON.parse(localStorage.cartIconIds);
  localStorage.cartIconIds = JSON.stringify(icons.filter((iconId) => (iconId !== id)));
  return id;
}

export function getCartIcons(iconIds) {
  return {
    type: FETCH_CART_DETAIL,
    payload: fetch.post('/icons', iconIds),
  };
}

export function initCart() {
  if (!localStorage.cartIconIds) {
    localStorage.cartIconIds = JSON.stringify([]);
  }
  return {
    type: INIT_CART,
    payload: JSON.parse(localStorage.cartIconIds),
  };
}

export function addIconToCart(id) {
  return {
    type: ADD_ICON_TO_CART,
    payload: addToLocalStorage(id),
  };
}

export function deleteIconInCart(id) {
  return {
    type: DELETE_ICON_IN_CART,
    payload: deleteInLocalStorage(id),
  };
}
