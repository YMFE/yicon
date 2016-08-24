/* eslint new-cap: ["error", { "capIsNewExceptions": ["STRING"] }] */
import { seq, Seq } from './_db';

export default seq.define('logs', {
  type: {
    type: Seq.STRING,
    allowNull: false,
  },
  scope: {
    type: Seq.STRING,
  },
  loggerId: {
    type: Seq.INTEGER,
  },
  operation: {
    type: Seq.STRING(3000),
    allowNull: false,
  },
}, {
  timestamps: true,
});
