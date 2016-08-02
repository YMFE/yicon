import isonFetch from 'isom-fetch';
import {
  FETCH_WORKBENCH_ICONS,
  DELETE_WORKBENCH_ICON,
} from '../constants/actionTypes';
const fetch = isonFetch.create({ baseURL: '/api' });

export function fetchWorkbench() {
  return {
    type: FETCH_WORKBENCH_ICONS,
    payload: fetch.get('/user/workbench'),
  };
}

export function uploadIcons() {
  return {};
}

export function deleteIcon(id) {
  // return (dispatch) => {
  //   fetch.delete(`/user/icons/${id}`).then(() => {
  //     dispatch({
  //       type: DELETE_WORKBENCH_ICON,
  //       payload: fetch.get('/user/workbench'),
  //     });
  //   });
  // };
  return {
    type: DELETE_WORKBENCH_ICON,
    payload: fetch.delete(`/user/icons/${id}`),
  };
}
