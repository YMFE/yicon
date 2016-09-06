/* eslint new-cap: ["error", { "capIsNewExceptions": ["STRING"] }] */
import { seq, Seq } from './_db';

export default seq.define('logs', {
  type: {
    type: Seq.STRING,
    allowNull: false,
    comment: '日志类型，如更换管理员、图标替换与删除等',
  },
  scope: {
    type: Seq.STRING,
    comment: '日志域，标记日志是项目相关还是大库相关',
  },
  loggerId: {
    type: Seq.INTEGER,
    comment: '记录对应的项目/大库的id',
  },
  operation: {
    type: Seq.STRING(5000),
    allowNull: false,
    comment: '记录日志操作内容',
  },
}, {
  timestamps: true,
  indexes: [{
    name: 'loggerId_scope_index',
    unique: false,
    method: 'BTREE',
    fields: ['loggerId', 'scope'],
  }],
});
