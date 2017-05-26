import isomFetch from 'isom-fetch';
import { replace } from 'react-router-redux';

import {
  FETCH_USERS_PROJECT_LIST,
  FETCH_USERS_PROJECT_INFO,
  FETCH_PUBLIC_PROJECT_LIST,
  FETCH_PUBLIC_PROJECT_INFO,
  SAVE_TO_NEW_PROJECT,
  CHOSE_PROJECT_FOR_SAVE,
  SAVE_TO_PROJECT,
  CREATE_EMPTY_PROJECT,
  PATCH_USERS_PROJECT_DETAIL,
  FETCH_MEMBERS_SUGGEST_LIST,
  PATCH_PROJECT_MEMBERS,
  POST_GENERATE_VERSION,
  DELETE_PROJECT,
  FETCH_PROJECT_LOG,
  DELETE_PROJECT_ICON,
  FETCH_ALL_PROJECT,
  FETCH_ALL_VERSION,
  COMPARE_PROJECT_VERSION,
  FETCH_HISTORY_PROJECT,
  SET_ADJUST_BASELINE,
  SET_SOURCE_PATH,
  GET_PATH_VERSION,
  UPLOAD_ICON_SOURCE,
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

function editUserProject(detail) {
  return {
    type: PATCH_USERS_PROJECT_DETAIL,
    payload: fetch.patch(`/user/projects/${detail.id}`, detail),
  };
}

export function patchUserProject(detail) {
  return (dispatch) => {
    dispatch(editUserProject(detail)).then(() => {
      dispatch(getUserProjectInfo(detail.id));
      dispatch(getUsersProjectList());
    });
  };
}

export function fetchMemberSuggestList(value) {
  return {
    type: FETCH_MEMBERS_SUGGEST_LIST,
    payload: fetch.get(`/user/list?q=${value}`),
  };
}

function editProjectMember(project) {
  return {
    type: PATCH_PROJECT_MEMBERS,
    payload: fetch.patch(`/user/projects/${project.id}/members`, project),
  };
}

export function patchProjectMemeber(project) {
  return (dispatch) => {
    dispatch(editProjectMember(project)).then(() => {
      dispatch(getUserProjectInfo(project.id));
    });
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
      version: project.version || '',
    }),
  };
}

function delProject(project) {
  return {
    type: DELETE_PROJECT,
    payload: fetch.delete(`/user/projects/${project.id}`),
  };
}

export function deleteProject(project) {
  return (dispatch) => {
    dispatch(delProject(project)).then(data => {
      if (data.payload.res) {
        dispatch(getUsersProjectList());
        dispatch(replace('/projects/'));
      }
    });
  };
}

export function fetchProjectLogs(id, page) {
  return {
    type: FETCH_PROJECT_LOG,
    payload: fetch.get(`/user/log/projects/${id}?currentPage=${page}`),
  };
}

export function delProjectIcon(id, icons) {
  return {
    type: DELETE_PROJECT_ICON,
    payload: fetch.delete(`/user/projects/${id}/icons`, { data: { icons } }),
  };
}

export function deleteProjectIcon(id, icon) {
  return (dispatch) => {
    dispatch(delProjectIcon(id, icon)).then(() => {
      dispatch(getUserProjectInfo(id));
    });
  };
}

export function fetchAllProjects() {
  return {
    type: FETCH_ALL_PROJECT,
    payload: fetch.get('/user/projects'),
  };
}

export function fetchAllVersions(id) {
  return {
    type: FETCH_ALL_VERSION,
    payload: fetch.get(`/projects/${id}/versions`),
  };
}

export function compareProjectVersion(projectId, highVersion, lowVersion) {
  return {
    type: COMPARE_PROJECT_VERSION,
    payload: fetch.get(`/user/projects/${projectId}/version/${highVersion}/version/${lowVersion}`),
  };
}

export function fetchHistoryProject(id, version) {
  const v = version ? `/version/${version}` : '';
  return {
    type: FETCH_HISTORY_PROJECT,
    payload: fetch.get(`/projects/${id}${v}`),
  };
}

export function adjustBaseline(id, baseline) {
  return {
    type: SET_ADJUST_BASELINE,
    payload: fetch.patch(`/user/projects/${id}/baseline`, { baseline: !baseline }),
  };
}

export function setSourcePath(project) {
  return {
    type: SET_SOURCE_PATH,
    payload: fetch.post(`/user/projects/${project.id}/source`, { path: project.sourcePath }),
  };
}

export function getPathAndVersion(id) {
  return {
    type: GET_PATH_VERSION,
    payload: fetch.get(`/user/projects/${id}/source/version`),
  };
}

export function uploadIconToSource(id, data) {
  return {
    type: UPLOAD_ICON_SOURCE,
    payload: fetch.post(`/user/projects/${id}/source/upload`, data),
  };
}

export function createEmptyProject(param) {
  return {
    type: CREATE_EMPTY_PROJECT,
    payload: fetch.post('/user/projects/empty', param),
  };
}
