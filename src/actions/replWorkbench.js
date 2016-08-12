import isonFetch from 'isom-fetch';
import {
  FETCH_CURR_ICON,
  FETCH_REPLACE_ICON,
  SUBMIT_REPLACE_ICON,
  REPL_UPDATE_ICON,
} from '../constants/actionTypes';
const fetch = isonFetch.create({ baseURL: '/api' });

export function fetchCurrIcon(iconId) {
  return {
    type: FETCH_CURR_ICON,
    payload: fetch.get(`/icons/${iconId}`),
  };
}

export function fetchReplaceIcon(iconId) {
  return {
    type: FETCH_REPLACE_ICON,
    payload: fetch.get(`/icons/${iconId}`),
  };
}

export function replUpdateIcon(icon) {
  return {
    type: REPL_UPDATE_ICON,
    payload: icon,
  };
}

export function submitReplaceIcon(fromId, toId, replaceIcon) {
  return {
    type: SUBMIT_REPLACE_ICON,
    payload: fetch.post(`/owner/replacement/icon/${fromId}...${toId}`, replaceIcon),
  };
}
