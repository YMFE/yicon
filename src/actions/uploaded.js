import isonFetch from 'isom-fetch';
import {
  FETCH_MY_LOADED,
  DELETE_ICON,
} from '../constants/actionTypes';
const fetch = isonFetch.create({ baseURL: '/api' });

export function fetchUploaded(currentPage) {
  return {
    type: FETCH_MY_LOADED,
    payload: fetch.get(`/user/icons?currentPage=${currentPage}`),
  };
}

export function deleteIcon(id, currentPage) {
  return (dispatch) => {
    dispatch({
      type: DELETE_ICON,
      payload: fetch.delete(`/user/icons/${id}`).then(response => {
        if (response.res) {
          dispatch(fetchUploaded(1, currentPage));
        }
      }),
    });
  };
}
