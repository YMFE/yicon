import isomFetch from 'isom-fetch';
import {
  FETCH_USERS_PROJECT_INFO,
  SAVE_TO_NEW_PROJECT,
  CHOSE_PROJECT_FOR_SAVE,
  SAVE_TO_PROJECT,
  FETCH_PROJECT_LOG,
} from '../constants/actionTypes';

const fetch = isomFetch.create({ baseURL: '/api' });

function getIconList(icons) {
  return icons.map((item) => ({
    id: item.id,
    name: item.name,
  }));
}

export function getUsersProjectInfo() {
  return {
    type: FETCH_USERS_PROJECT_INFO,
    payload: fetch.get('/user/projects'),
  };
}

export function saveToNewProject(projectName, icons) {
  return {
    type: SAVE_TO_NEW_PROJECT,
    payload: fetch.post('/user/projects', {
      projectName,
      icons: getIconList(icons),
    }),
  };
}

export function saveToProject(project, icons) {
  return {
    type: SAVE_TO_PROJECT,
    payload: fetch.post(`/user/projects/${project.id}/icons`, {
      icons: getIconList(icons),
    }),
  };
}

export function choseProjectForSave(project) {
  return {
    type: CHOSE_PROJECT_FOR_SAVE,
    payload: project,
  };
}

export function fetchProjectLogs(id, page) {
  return {
    type: FETCH_PROJECT_LOG,
    payload: fetch.get(`/user/log/projects/${id}?currentPage=${page}`),
  };
}
