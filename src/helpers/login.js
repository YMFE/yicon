// 统一处理登录跳转
import { simpleParse } from './utils';

function qualifyUrl() {
  const url = '/api/login';
  const { protocol, host, pathname } = location;
  const prefix = /^\//.test(url) ? '' : pathname.match(/.*\//);

  return encodeURIComponent(`${protocol}//${host}${prefix}${url}`);
}

function redirectUrl() {
  const authServiceUrl = window.__AUTH.AUTH_URL;
  const rUrl = qualifyUrl();
  location.href = simpleParse(authServiceUrl, { service: rUrl });
}

export default (isDelay = false, time = 1000) => {
  if (isDelay) {
    setTimeout(() => redirectUrl(), time);
  } else {
    redirectUrl();
  }
};
