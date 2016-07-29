import isonFetch from 'isom-fetch';
import {
  FETCH_ALL_PROJECT,
  FETCH_ALL_VERSION,
  COMPARE_PROJECT_VERSION,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });

export function fetchAllProjects() {
  return {
    type: FETCH_ALL_PROJECT,
    payload: fetch.get('/user/projects'),
  };
}

export function fetchAllVersions(id) {
  return {
    type: FETCH_ALL_VERSION,
    payload: fetch.get(`/user/projects/${id}/versions`),
  };
}

export function compareProjectVersion(projectId, highVersion, lowVersion) {
  return {
    type: COMPARE_PROJECT_VERSION,
    payload: fetch.get(`/user/projects/${projectId}/version/${highVersion}/version/${lowVersion}`),
  };
}

export function getAllProjects() {
  return dispatch => {
    dispatch(fetchAllProjects());
  };
}

export function getAllVersions(id) {
  return dispatch => {
    dispatch(fetchAllVersions(id));
  };
}

export function compareVersion(projectId, highVersion, lowVersion) {
  return dispatch => {
    dispatch(compareProjectVersion(projectId, highVersion, lowVersion));
  };
}
