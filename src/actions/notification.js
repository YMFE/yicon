import isonFetch from 'isom-fetch';
import {
  FETCH_UNREAD_COUNT,
  FETCH_ALL_INFO,
  FETCH_SYSTEM_INFO,
  FETCH_PROJECT_INFO,
  FETCH_INFO_DETAIL,
  SET_POLLING_ID,
  SET_INFO_READED,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api/user' });

export function fetchAllInfo(currentPage) {
  return {
    type: FETCH_ALL_INFO,
    payload: fetch.get(`/notifications/type/all?currentPage=${currentPage}`),
  };
}
export function fetchSystemInfo(currentPage) {
  return {
    type: FETCH_SYSTEM_INFO,
    payload: fetch.get(`/notifications/type/system?currentPage=${currentPage}`),
  };
}
export function fetchProjectInfo(currentPage) {
  return {
    type: FETCH_PROJECT_INFO,
    payload: fetch.get(`/notifications/type/project?currentPage=${currentPage}`),
  };
}
export function getInfo(tag, page = 1) {
  return (dispatch) => {
    switch (tag) {
      case 'all':
        dispatch(fetchAllInfo(page));
        break;
      case 'system':
        dispatch(fetchSystemInfo(page));
        break;
      case 'project':
        dispatch(fetchProjectInfo(page));
        break;
      default:
        dispatch(fetchAllInfo(1));
        dispatch(fetchSystemInfo(1));
        dispatch(fetchProjectInfo(1));
        break;
    }
  };
}
export function fetchUnreadNotification(type = 'all') {
  return {
    type: FETCH_UNREAD_COUNT,
    payload: fetch.get(`/unread/notifications/type/${type}`),
  };
}
export function getInfoDetail(id) {
  return {
    type: FETCH_INFO_DETAIL,
    payload: fetch.get(`/notifications/${id}`),
  };
}

export function setPollingId(id) {
  return {
    type: SET_POLLING_ID,
    payload: id,
  };
}

export function setInfoReaded(info) {
  return {
    type: SET_INFO_READED,
    payload: info,
  };
}
