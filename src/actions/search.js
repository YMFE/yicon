import isonFetch from 'isom-fetch';
import {
  FETCH_SEARCH_RESULT,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });
export function fetchSearchResult(key) {
  return {
    type: FETCH_SEARCH_RESULT,
    payload: fetch.get(`/icons?q=${key}`),
  };
}
