import isomFetch from 'isom-fetch';
import {
  FETCH_AUDIT_LIST,
} from '../constants/actionTypes';

const fetch = isomFetch.create({ baseURL: '/api/owner' });

export function fetchAuditList() {
  return {
    type: FETCH_AUDIT_LIST,
    payload: fetch.get('/icons'),
  };
}
