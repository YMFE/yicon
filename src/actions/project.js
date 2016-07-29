import isonFetch from 'isom-fetch';
import {
  FETCH_USERS_PROJECT_LIST,
  FETCH_USERS_PROJECT_INFO,
  FETCH_PUBLIC_PROJECT_LIST,
  FETCH_PUBLIC_PROJECT_INFO,
  SAVE_TO_NEW_PROJECT,
  CHOSE_PROJECT_FOR_SAVE,
  SAVE_TO_PROJECT,
  PATCH_USERS_PROJECT_DETAIL,
  FETCH_MEMBERS_SUGGEST_LIST,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });

function getIconList(icons) {
  return icons.map((item) => ({
    id: item.id,
    name: item.name,
  }));
}

export function getUsersProjectList() {
  return {
    type: FETCH_USERS_PROJECT_LIST,
    payload: fetch.get('/user/projects'),
  };
}

export function getUserProjectInfo(id, version) {
  const v = version ? `/version/${version}` : '';
  return {
    type: FETCH_USERS_PROJECT_INFO,
    payload: fetch.get(`/user/projects/${id}${v}`),
  };
}

export function patchUserProject(detail) {
  return {
    type: PATCH_USERS_PROJECT_DETAIL,
    payload: fetch.patch(`/user/projects/${detail.id}`, detail),
  };
}

export function fetchMemberSuggestList(value) {
  return {
    type: FETCH_MEMBERS_SUGGEST_LIST,
    payload: fetch.get(`/user/list?q=${value}`),
  };
}

export function getPublicProjectList() {
  return {
    type: FETCH_PUBLIC_PROJECT_LIST,
    payload: fetch.get('/projects'),
  };
}
export function getPublicProjectInfo(id, version) {
  const v = version ? `/version/${version}` : '';
  return {
    type: FETCH_PUBLIC_PROJECT_INFO,
    payload: fetch.get(`/projects/${id}${v}`),
  };
}

export function saveToNewProject(projectName, icons) {
  return {
    type: SAVE_TO_NEW_PROJECT,
    payload: fetch.post('/user/project', {
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
    payload: {
      project,
    },
  };
}
