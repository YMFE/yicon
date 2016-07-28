import isonFetch from 'isom-fetch';
import {
  FETCH_HOME_DATA,
  FETCH_TINY_REPOSITORY,
  FETCH_REPOSITORY_DATA,
  CLEAR_REPOSITORY_DATA,
  CHANGE_ICON_SIZE,
  RESET_ICON_SIZE,
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

function fetchRepository(id, currentPage) {
  return {
    type: FETCH_REPOSITORY_DATA,
    payload: fetch.get(`/repositories/${id}?currentPage=${currentPage}&pageSize=64`),
  };
}

export function fetchTinyRepository() {
  return {
    type: FETCH_TINY_REPOSITORY,
    payload: fetch.get('/tiny/repositories'),
  };
}

export function clearRepositoryData() {
  return {
    type: CLEAR_REPOSITORY_DATA,
  };
}

export function fetchRepositoryData(id, currentPage) {
  return (dispatch, getState) => {
    const repoId = getState().repository.currRepository.id;
    if (+repoId !== +id) dispatch(clearRepositoryData());
    dispatch(fetchRepository(id, currentPage));
  };
}

export function changeIconSize(size) {
  return {
    type: CHANGE_ICON_SIZE,
    payload: size,
  };
}

export function resetIconSize() {
  return { type: RESET_ICON_SIZE };
}
