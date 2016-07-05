import isonFetch from 'isom-fetch';
import {
  FETCH_REPOSITORY_DATA,
} from '../constants/actionTypes';

const fetch = isonFetch.create({
  baseURL: '/api',
  thunk: true,
});

export function getCurrRepository(id) {
  return {
    type: FETCH_REPOSITORY_DATA,
    payload: fetch.get(`/repositories/${id}`),
  };
}
