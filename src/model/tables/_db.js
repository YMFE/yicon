import Sequelize from 'sequelize';
import config from '../../config';
import debugTool from 'debug';

const debug = debugTool('database');
const { model } = config;

const sequelize = new Sequelize(
  model.database,
  model.username,
  model.password,
  {
    port: model.port,
    host: model.host,
    define: {
      charset: 'utf8',
      timestamps: false,
    },
  }
);

sequelize.authenticate()
  .then(() =>
    debug('Connection has been established successfully.')
  )
  .catch(err =>
    debug('Unable to connect to the database:', err)
  );

export { sequelize as seq };
export { Sequelize as Seq };
