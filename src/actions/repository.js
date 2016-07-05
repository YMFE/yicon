import isonFetch from 'isom-fetch';
import {
  FETCH_HOME_DATA,
  FETCH_REPOSITORY_DATA,
  CLEAR_REPOSITORY_DATA,
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

export function fetchRepositoryData(id) {
  return {
    type: FETCH_REPOSITORY_DATA,
    payload: fetch.get(`/repositories/${id}`),
  };
}

export function clearRepositoryData() {
  return {
    type: CLEAR_REPOSITORY_DATA,
    payload: {
      icons: [],
    },
  };
}
