import isonFetch from 'isom-fetch';
import {
  FETCH_AUDIT_ICONS,
  AUDIT_ICONS,
  UPDATE_AUDIT_ICONS,
  SELECT_AUDIT_ICON,
} from '../constants/actionTypes';
const fetch = isonFetch.create({ baseURL: '/api' });

export function fetchAuditIcons() {
  return {
    type: FETCH_AUDIT_ICONS,
    payload: fetch.get('/owner/icons'),
  };
}

export function auditIcons(icons) {
  return {
    type: AUDIT_ICONS,
    payload: fetch.post('/owner/icons', icons),
  };
}

export function updateAuditIcons(icons) {
  return {
    type: UPDATE_AUDIT_ICONS,
    payload: icons,
  };
}

export function selectIcon(index) {
  return {
    type: SELECT_AUDIT_ICON,
    payload: index,
  };
}
