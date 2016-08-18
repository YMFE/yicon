import Sequelize from 'sequelize';
import config from '../../config';
import logger from '../../logger';

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
    /* eslint-disable no-console */
    logging: __DEVELOPMENT__ ? logger.info.bind(logger) : false,
  }
);

sequelize.authenticate()
  .then(() =>
    logger.info('Connection has been established successfully.')
  )
  .catch(err =>
    logger.error('Unable to connect to the database:', err)
  );

export { sequelize as seq };
export { Sequelize as Seq };
