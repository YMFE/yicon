const common = {
  path: {
    caches: '../caches',
    font: 'download/font',
    svg: 'download/svg',
    png: 'download/png',
  },
  log: {
    appenders: [
      { category: 'normal', type: 'console' },
    ],
  },
};

const env = {
  development: {
    model: {
      database: 'iconfont',
      username: 'root',
      password: 'odmMj7H6x2IaACrs',
      dialect: 'mysql',
      port: '3306',
      host: '10.86.43.48',
    },
    port: 3000,
  },
  // 开发机
  dev: {
    model: {
      database: 'iconfont-dev',
      username: 'root',
      password: 'odmMj7H6x2IaACrs',
      dialect: 'mysql',
      port: '3306',
      host: '10.86.43.48',
    },
    port: 3000,
  },
  // beta 机器
  beta: {
  },
  // 线上机器
  production: {
    // 暂时写这个
    model: {
      database: 'iconfont-dev',
      username: 'root',
      password: 'odmMj7H6x2IaACrs',
      dialect: 'mysql',
      port: '3306',
      host: '10.86.43.48',
    },
    port: 3000,
  },
};

const config = env[process.env.NODE_ENV];

export default { ...common, ...config };
