import isonFetch from 'isom-fetch';
import {
  FETCH_LDAPAUTH,
} from '../constants/actionTypes';

const fetch = isonFetch.create({ baseURL: '/api' });

export function fetchLdapAuth(param) {
  return {
    type: FETCH_LDAPAUTH,
    payload: fetch.post('/ldapauth', param).then(data => {
      if (data.data.isValid === true) {
        return fetch.post('/login', {
          userId: param.username,
          username: param.username,
        }).then(result => ({
          ...result,
          data: data.data,
        }));
      }

      return data;
    }),
  };
}
