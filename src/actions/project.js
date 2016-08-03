import isomFetch from 'isom-fetch';
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
  PATCH_PROJECT_MEMBERS,
  POST_GENERATE_VERSION,
  DELETE_PROJECT,
  FETCH_PROJECT_LOG,
  TETCH_PROJECT_VERSION,
  DELETE_PROJECT_ICON,
} from '../constants/actionTypes';

const fetch = isomFetch.create({ baseURL: '/api' });

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
    project: detail,
  };
}

export function fetchMemberSuggestList(value) {
  return {
    type: FETCH_MEMBERS_SUGGEST_LIST,
    payload: fetch.get(`/user/list?q=${value}`),
  };
}

export function patchProjectMemeber(project) {
  return {
    type: PATCH_PROJECT_MEMBERS,
    payload: fetch.patch(`/user/projects/${project.id}/members`, project),
    project,
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
    success: () => {
      this.getUsersProjectList();
      this.getUserProjectInfo(id);
    },
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
export function generateVersion(project) {
  return {
    type: POST_GENERATE_VERSION,
    payload: fetch.post(`/user/projects/${project.id}/update`, {
      versionType: project.versionType,
    }),
    project,
  };
}

export function deleteProject(project) {
  return {
    type: DELETE_PROJECT,
    payload: fetch.delete(`/user/projects/${project.id}`),
  };
}

export function fetchProjectLogs(id, page) {
  return {
    type: FETCH_PROJECT_LOG,
    payload: fetch.get(`/user/log/projects/${id}?currentPage=${page}`),
  };
}

export function fetchProjectVersions(id) {
  return {
    type: TETCH_PROJECT_VERSION,
    payload: fetch.get(`/user/projects/${id}/versions`),
  };
}

export function deletePorjectIcon(id, icon) {
  const obj = {
    icons: icon,
  };
  // console.log(obj);
  return {
    type: DELETE_PROJECT_ICON,
    payload: fetch.delete(`/user/projects/${id}/icons`, {
      data: obj,
    }),
    id,
  };
}
