const common = {};

const development = {
  model: {
    database: 'iconfont',
    username: 'root',
    password: '123456',
    dialect: 'mysql',
    port: '3306',
    host: '127.0.0.1',
  },
};
const production = {};

export default process.env.NODE_ENV !== 'production'
  ? { ...common, ...development }
  : { ...common, ...production };
