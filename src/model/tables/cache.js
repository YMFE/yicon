/* eslint new-cap: ["error", { "capIsNewExceptions": ["STRING"] }] */
import { seq, Seq } from './_db';

export default seq.define('cache', {
  svg: {
    type: Seq.STRING(10000),
    allowNull: false,
    comment: '原始svg图标',
  },
});
