import isonFetch from 'isom-fetch';
import {
  FETCH_UPLOAD_ICON,
} from '../constants/actionTypes';
const fetch = isonFetch.create({ baseURL: '/api' });

export function fetchUpload(icons) {
  return {
    type: FETCH_UPLOAD_ICON,
    payload: fetch.post(`/user/icons?icons=${icons}`),
  };
}
