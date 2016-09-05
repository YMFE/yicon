import {
  LAUNCH_REDUX_DEVTOOLS,
  FETCH_USER_INFO,
} from '../constants/actionTypes';
import isomFetch from 'isom-fetch';

const fetch = isomFetch.create({ baseURL: '/api/user' });

export function launchDevTools() {
  return { type: LAUNCH_REDUX_DEVTOOLS };
}

export function fetchUserInfo() {
  return {
    type: FETCH_USER_INFO,
    payload: fetch.post('/info'),
  };
}
