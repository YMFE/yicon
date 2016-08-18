const common = {
  path: {
    caches: '../caches',
    font: 'download/font',
    svg: 'download/svg',
    png: 'download/png',
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
    log: {
      appenders: [
        { category: 'normal', type: 'console' },
      ],
    },
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
    log: {
      appenders: [
        {
          category: 'normal',
          type: 'dateFile',
          filename: 'log',
          alwaysIncludePattern: true,
          pattern: '-yyyy-MM-dd.log',
        },
      ],
    },
  },
  // beta 机器
  beta: {
    log: {
      appenders: [
        {
          category: 'normal',
          type: 'dateFile',
          filename: 'log',
          alwaysIncludePattern: true,
          pattern: '-yyyy-MM-dd.log',
        },
      ],
    },
  },
  // 线上机器
  production: {
    log: {
      appenders: [
        {
          category: 'normal',
          type: 'dateFile',
          filename: 'log',
          alwaysIncludePattern: true,
          pattern: '-yyyy-MM-dd.log',
        },
      ],
    },
  },
};

const config = env[process.env.NODE_ENV];

export default { ...common, ...config };
