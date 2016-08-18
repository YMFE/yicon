import invariant from 'invariant';

const DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

let urlState = '__FETCH_URLS__';

export default {
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*',
    },
    patch: { ...DEFAULT_CONTENT_TYPE },
    post: { ...DEFAULT_CONTENT_TYPE },
    put: { ...DEFAULT_CONTENT_TYPE },
  },

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
};

export const setUrlState = name => {
  invariant(
    typeof name === 'string',
    'urlState 只能为字符串'
  );

  urlState = name;
};

export const getUrlState = () => urlState;
