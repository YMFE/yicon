import isonFetch from 'isom-fetch';
import {
  FETCH_HOME_DATA,
} from '../constants/actionTypes';

const fetch = isonFetch.create({
  baseURL: '/api',
  thunk: true,
});

export function fetchHomeData() {
  return {
    type: FETCH_HOME_DATA,
    payload: fetch.get('/repositories'),
  };
}
