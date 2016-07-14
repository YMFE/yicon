/* eslint new-cap: ["error", { "capIsNewExceptions": ["STRING"] }] */
import { logTypes } from '../../constants/utils';
import { seq, Seq } from './_db';

export default seq.define('logs', {
  type: {
    type: Seq.STRING,
    allowNull: false,
    validate: {
      isIn: Object.keys(logTypes),
    },
  },
  scope: {
    type: Seq.STRING,
  },
  loggerId: {
    type: Seq.INTEGER,
  },
  operation: {
    type: Seq.STRING(1000),
    allowNull: false,
  },
}, {
  timestamps: true,
});
