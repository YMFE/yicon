const config = require('../../config.json');
const path = require('path');
const common = {
  path: {
    caches: path.join(__dirname, '../../caches'),
    font: 'download/font',
    svg: 'download/svg',
    png: 'download/png',
  },
};

const configPool = config.production ? config : {
  // 生产环境
  production: {
    ...config,
  },

  // 开发环境
  development: {
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

export default { ...common, ...configPool[process.env.NODE_ENV] };
