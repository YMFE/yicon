import isomFetch from 'isom-fetch';
import { push } from 'react-router-redux';
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
  FETCH_ALL_PROJECT,
  FETCH_ALL_VERSION,
  COMPARE_PROJECT_VERSION,
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
  return (dispatch) => {
    dispatch({
      type: PATCH_USERS_PROJECT_DETAIL,
      payload: fetch.patch(`/user/projects/${detail.id}`, detail).then(
        responese => {
          if (responese.res) {
            dispatch(getUserProjectInfo(detail.id));
            dispatch(getUsersProjectList());
          }
        }
      ),
      project: detail,
    });
  };
}

export function fetchMemberSuggestList(value) {
  return {
    type: FETCH_MEMBERS_SUGGEST_LIST,
    payload: fetch.get(`/user/list?q=${value}`),
  };
}

export function patchProjectMemeber(project) {
  return (dispatch) => {
    dispatch({
      type: PATCH_PROJECT_MEMBERS,
      payload: fetch.patch(`/user/projects/${project.id}/members`, project).then(
        (responese) => {
          if (responese.res) {
            dispatch(getUserProjectInfo(project.id));
          }
        }
      ),
      project,
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
  return (dispatch) => {
    dispatch({
      type: SAVE_TO_NEW_PROJECT,
      payload: fetch.post('/user/projects', {
        projectName,
        icons: getIconList(icons),
      }).then((data) => {
        if (data.res) {
          dispatch(push(`/user/projects/${data.data.id}`));
        }
        return data;
      }),
    });
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
  return (dispatch) => {
    dispatch({
      type: POST_GENERATE_VERSION,
      payload: fetch.post(`/user/projects/${project.id}/update`, {
        versionType: project.versionType,
      }).then(
        responese => {
          if (responese.res) {
            dispatch(getUserProjectInfo(project.id));
          }
        }
      ),
      project,
    });
  };
}

export function deleteProject(project) {
  return (dispatch) => {
    dispatch({
      type: DELETE_PROJECT,
      payload: fetch.delete(`/user/projects/${project.id}`).then((data) => {
        if (data.res) {
          dispatch(getUsersProjectList());
          dispatch(push('/user/projects/'));
        }
      }),
    });
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
  return (dispatch) => {
    dispatch({
      type: DELETE_PROJECT_ICON,
      payload: fetch.delete(`/user/projects/${id}/icons`, {
        data: obj,
      }).then((response) => {
        if (response.res) {
          dispatch(getUserProjectInfo(id));
        }
      }),
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
    payload: fetch.get(`/user/projects/${id}/versions`),
  };
}

export function compareProjectVersion(projectId, highVersion, lowVersion) {
  return {
    type: COMPARE_PROJECT_VERSION,
    payload: fetch.get(`/user/projects/${projectId}/version/${highVersion}/version/${lowVersion}`),
  };
}
