import isonFetch from 'isom-fetch';
import {
  FETCH_HOME_DATA,
  FETCH_TINY_REPOSITORY,
  FETCH_REPOSITORY_DATA,
  // CHANGE_ICON_SIZE,
  // RESET_ICON_SIZE,
  FETCH_REPOSITORY_LOG,
} from '../constants/actionTypes';

const fetch = isonFetch.create({
  baseURL: '/api',
});

export function fetchHomeData() {
  return {
    type: FETCH_HOME_DATA,
    payload: fetch.get('/repositories'),
  };
}

export function fetchRepository(id) {
  return {
    type: FETCH_REPOSITORY_DATA,
    payload: fetch.get(`/repositories/${id}`),
  };
}

export function fetchTinyRepository() {
  return {
    type: FETCH_TINY_REPOSITORY,
    payload: fetch.get('/tiny/repositories'),
  };
}

// export function changeIconSize(size) {
//   return {
//     type: CHANGE_ICON_SIZE,
//     payload: size,
//   };
// }
//
// export function resetIconSize() {
//   return { type: RESET_ICON_SIZE };
// }

export function fetchRepositoryLogs(id, page) {
  return {
    type: FETCH_REPOSITORY_LOG,
    payload: fetch.get(`/owner/log/repositories/${id}?currentPage=${page}`),
  };
}
