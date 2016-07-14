import isonFetch from 'isom-fetch';
import {
  INIT_CART,
  FETCH_CART_DETAIL,
  ADD_ICON_TO_CART,
  DELETE_ICON_IN_CART,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });

// ls.cartIconIds为Set类型
const ls = {
  get cartIconIds() {
    localStorage.cartIconIds = localStorage.cartIconIds || JSON.stringify([]);
    return new Set(JSON.parse(localStorage.cartIconIds));
  },
  set cartIconIds(value) {
    localStorage.cartIconIds = JSON.stringify(Array.from(value));
  },
};

function addToLocalStorage(id) {
  const iconIds = ls.cartIconIds;
  ls.cartIconIds = iconIds.add(id);
  return Array.from(ls.cartIconIds);
}
function deleteInLocalStorage(id) {
  const iconIds = ls.cartIconIds;
  iconIds.delete(id);
  ls.cartIconIds = iconIds;
  return Array.from(ls.cartIconIds);
}

export function getIconsInCart(iconIds) {
  return {
    type: FETCH_CART_DETAIL,
    payload: fetch.post('/icons', iconIds),
  };
}

export function getIconsInLocalStorage() {
  return {
    type: INIT_CART,
    payload: Array.from(ls.cartIconIds),
  };
}

export function addIconToLocalStorage(id) {
  return {
    type: ADD_ICON_TO_CART,
    payload: addToLocalStorage(id),
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
      payload: icons,
    });
  };
}
