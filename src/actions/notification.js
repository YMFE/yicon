import isonFetch from 'isom-fetch';
import {
  FETCH_ALL_INFO,
  FETCH_SYSTEM_INFO,
  FETCH_PROJECT_INFO,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });

export function fetchAllInfo(page) {
  return {
    type: FETCH_ALL_INFO,
    payload: fetch.post('/user/notifications/type/all', {
      currentPage: page,
    }),
  };
}
export function fetchSystemInfo(page) {
  return {
    type: FETCH_SYSTEM_INFO,
    payload: fetch.post('/user/notifications/type/system', {
      currentPage: page,
    }),
  };
}
export function fetchProjectInfo(page) {
  return {
    type: FETCH_PROJECT_INFO,
    payload: fetch.post('/user/notifications/type/project', {
      currentPage: page,
    }),
  };
}
export function getInfo() {
  return (dispatch) => {
    dispatch(fetchAllInfo(1));
    dispatch(fetchSystemInfo(1));
    dispatch(fetchProjectInfo(1));
  };
}
