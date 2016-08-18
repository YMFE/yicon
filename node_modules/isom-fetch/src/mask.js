import defaults from './defaults';

function combineURLs(baseURL, relativeURL) {
  return `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}`;
}

function isAbsoluteURL(url) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

export const getURL = config => {
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    return combineURLs(config.baseURL, config.url);
  }
  return config.url || '';
};

export const getRequest = (defConfig = {}, config) => {
  config = { ...defaults, ...defConfig, ...config };

  config.url = getURL(config);

  config.withCredentials = config.withCredentials || defConfig.withCredentials;

  // 配合 bodyParser，将对象转化到 body 而非 data 上
  config.body = config.data;

  // Flatten headers
  config.headers = {
    ...config.headers.common || {},
    ...config.headers[config.method] || {},
    ...config.headers || {},
  };

  ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'].forEach(method => {
    delete config.headers[method];
  });

  config.socket = null;

  return config;
};

export const getResponse = () => {
  // 这两个函数的调用在虚拟响应里没有效果
  const setHeader = () => {};
  const removeHeader = () => {};

  return {
    statusCode: 200,
    statusMessage: 'OK',
    setHeader,
    removeHeader,
    socket: null,
  };
};
