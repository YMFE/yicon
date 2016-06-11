import Sequelize from 'sequelize';
import config from '../../config';

const { model } = config;

const define = {
  charset: 'utf8',
  timestamps: false,
};

const sequelize = new Sequelize(
  model.database,
  model.username,
  model.password,
  { define }
);

export { sequelize as seq };
export { Sequelize as Seq };
