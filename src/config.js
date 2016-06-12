const common = {};

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
const production = {};

export default process.env.NODE_ENV !== 'production'
  ? { ...common, ...development }
  : { ...common, ...production };
