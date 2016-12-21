const config = require('../config.json');

const configPool = {
  // 生产环境
  production: {
    ...config,
  },

  // 开发环境
  development: {
    path: config.path,
    model: {
      ...config.model,
    },
    port: 3000,
    log: {
      appenders: [
        { category: 'normal', type: 'console' },
      ],
    },
    login: {
      ...config.login,
    },
  },
};

export default { ...configPool[process.env.NODE_ENV] };
