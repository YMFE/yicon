import isonFetch from 'isom-fetch';
import { push } from 'react-router-redux';
import {
  FETCH_SEARCH_RESULT,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });
export function fetchSearchResult(key) {
  return {
    type: FETCH_SEARCH_RESULT,
    payload: fetch.get(`/icons?q=${key}`),
    // key,
  };
}

export function fetchSearchData(query) {
  return (dispatch) => {
    if (query) dispatch(fetchSearchResult(query));
  };
}

export function redirectTo(url) {
  return (dispatch) => {
    dispatch(push(url));
  };
}
