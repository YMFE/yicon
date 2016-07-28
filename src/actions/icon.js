import isonFetch from 'isom-fetch';
import {
  FETCH_ICON_DETAIL,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });

export function getIconDetail(iconId) {
  return {
    type: FETCH_ICON_DETAIL,
    payload: fetch.get(`/icons/${iconId}`),
  };
}
