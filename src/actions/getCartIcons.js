import isonFetch from 'isom-fetch';
import {
  GET_CART_DES,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });

export function getCartIcons(iconIds) {
  return {
    type: GET_CART_DES,
    payload: fetch.post('/icons', iconIds),
  };
}
