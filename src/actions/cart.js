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
  const icons = JSON.parse(localStorage.cartIconIds);
  if (icons.indexOf(id) === -1) {
    localStorage.cartIconIds = JSON.stringify(icons.concat([id]));
  }
}
function deleteInLocalStorage(id) {
  if (!localStorage.cartIconIds) {
    localStorage.cartIconIds = JSON.stringify([]);
  }
  const icons = JSON.parse(localStorage.cartIconIds).filter((iconId) => (iconId !== id));
  localStorage.cartIconIds = JSON.stringify(icons);
  return icons;
}

export function getIconsInCart(iconIds) {
  return {
    type: FETCH_CART_DETAIL,
    payload: fetch.post('/icons', iconIds),
  };
}

export function getIconsInLocalStorage() {
  if (!localStorage.cartIconIds) {
    localStorage.cartIconIds = JSON.stringify([]);
  }
  return {
    type: INIT_CART,
    payload: JSON.parse(localStorage.cartIconIds),
  };
}

export function addIconToLocalStorage(id) {
  return (dispatch, getState) => {
    addToLocalStorage(id);
    const { iconsInLocalStorage } = getState().cart;
    if (iconsInLocalStorage.indexOf(id) === -1) {
      dispatch({
        type: ADD_ICON_TO_CART,
        payload: id,
      });
    }
  };
}

export function deleteIconInLocalStorage(id, isFetchIcons) {
  return (dispatch) => {
    const icons = deleteInLocalStorage(id);
    if (isFetchIcons) {
      dispatch(getIconsInCart({ icons }));
    }
    dispatch({
      type: DELETE_ICON_IN_CART,
      payload: id,
    });
  };
}
