import isonFetch from 'isom-fetch';
import {
  FETCH_ALL_INFO,
  FETCH_SYSTEM_INFO,
  FETCH_PROJECT_INFO,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });

export function fetchAllInfo(currentPage) {
  return {
    type: FETCH_ALL_INFO,
    payload: fetch.get(`/user/notifications/type/all?currentPage=${currentPage}`),
  };
}
export function fetchSystemInfo(currentPage) {
  return {
    type: FETCH_SYSTEM_INFO,
    payload: fetch.get(`/user/notifications/type/system?currentPage=${currentPage}`),
  };
}
export function fetchProjectInfo(currentPage) {
  return {
    type: FETCH_PROJECT_INFO,
    payload: fetch.get(`/user/notifications/type/project?currentPage=${currentPage}`),
  };
}
export function getInfo() {
  return (dispatch) => {
    dispatch(fetchAllInfo(1));
    dispatch(fetchSystemInfo(1));
    dispatch(fetchProjectInfo(1));
  };
}
