const common = {
  path: {
    caches: '../caches',
    font: 'download/font',
    svg: 'download/svg',
    png: 'download/png',
  },
};

const development = {
  model: {
    database: 'iconfont',
    username: 'root',
    password: 'odmMj7H6x2IaACrs',
    dialect: 'mysql',
    port: '3306',
    host: '10.86.43.48',
  },
  port: 3000,
};
// 暂时线上也用这个
const production = {
  model: {
    database: 'iconfont',
    username: 'root',
    password: 'odmMj7H6x2IaACrs',
    dialect: 'mysql',
    port: '3306',
    host: '10.86.43.48',
  },
  port: 3000,
};

export default process.env.NODE_ENV !== 'production'
  ? { ...common, ...development }
  : { ...common, ...production };
