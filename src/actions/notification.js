import isonFetch from 'isom-fetch';
import {
  FETCH_UNREAD_COUNT,
  FETCH_ALL_INFO,
  FETCH_SYSTEM_INFO,
  FETCH_PROJECT_INFO,
  FETCH_UNREAD_INFO,
  FETCH_INFO_DETAIL,
  SET_POLLING_ID,
  SET_INFO_READED,
  SET_ALL_READED,
  SUBMIT_PUBLICK_PROJECT,
  PUBLIC_PROJECT_LIST,
  AGREE_PUBLIC_PROJECT,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api/user' });
const fetchAdmin = isonFetch.create({ baseURL: '/api/admin' });

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
export function fetchUnreadInfo(currentPage) {
  return {
    type: FETCH_UNREAD_INFO,
    payload: fetch.get(`/notifications/type/unread?currentPage=${currentPage}`),
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
      case 'unread':
        dispatch(fetchUnreadInfo(page));
        break;
      default:
        dispatch(fetchAllInfo(1));
        dispatch(fetchSystemInfo(1));
        dispatch(fetchProjectInfo(1));
        dispatch(fetchUnreadInfo(1));
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

export function submitPublicProject(data) {
  return {
    type: SUBMIT_PUBLICK_PROJECT,
    payload: fetch.post('/notification/submitpublicproject', data),
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

export function setAllReaded() {
  return {
    type: SET_ALL_READED,
    payload: fetch.patch('/notification/all/readed'),
  };
}

export function publicProjectList(data) {
  return {
    type: PUBLIC_PROJECT_LIST,
    payload: fetch.get(`/projectspublic/${data}`),
  };
}

export function agreePublicProject(data) {
  return {
    type: AGREE_PUBLIC_PROJECT,
    payload: fetchAdmin.post('/notification/agreepublicproject', data),
  };
}
