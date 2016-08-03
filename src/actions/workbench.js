import isonFetch from 'isom-fetch';
import {
  FETCH_WORKBENCH_ICONS,
  DELETE_WORKBENCH_ICON,
  UPDATE_WORKBENCH,
  UPLOAD_ICONS,
  SELECT_EDIT,
  SELECT_REPO,
} from '../constants/actionTypes';
const fetch = isonFetch.create({ baseURL: '/api' });

export function fetchWorkbench() {
  return {
    type: FETCH_WORKBENCH_ICONS,
    payload: fetch.get('/user/workbench'),
  };
}

export function uploadIcons(iconsData) {
  return {
    type: UPLOAD_ICONS,
    payload: fetch.patch('/user/icons', iconsData),
  };
}

export function deleteIcon(id, icons) {
  return (dispatch) => {
    fetch.delete(`/user/icons/${id}`).then((data) => {
      if (data.res) {
        dispatch({
          type: DELETE_WORKBENCH_ICON,
          payload: icons,
        });
      }
    });
  };
}

export function updateWorkbench(icons) {
  return {
    type: UPDATE_WORKBENCH,
    payload: icons,
  };
}

export function selectEdit(index) {
  return {
    type: SELECT_EDIT,
    payload: index,
  };
}

export function selectRepo(repoId) {
  return {
    type: SELECT_REPO,
    payload: repoId,
  };
}
