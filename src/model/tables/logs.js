/* eslint new-cap: ["error", { "capIsNewExceptions": ["STRING"] }] */

import { seq, Seq } from './_db';

// TODO: 思考一下模板放到哪儿比较合适（或许是全局）
// 这里或许可以写在数据库，通过 dao 来实现
const descriptionMap = {
  UPLOAD_SUCCEED: '',
  AUDIT_SUCCEED: '',
  AUDIT_FAILED: '',
  REPLACE_SUCCEED: '',
  PROJECT_INSERT: '',
  PROJECT_REMOVE: '',
  PROJECT_OWNER: '',
  REPO_ADMIN: '',
};

export default seq.define('logs', {
  type: {
    type: Seq.STRING,
    allowNull: false,
    validate: {
      isIn: ['repo', 'project'],
    },
  },
  iconAdded: Seq.STRING,
  iconRemoved: Seq.STRING,
  operation: {
    type: Seq.STRING,
    allowNull: false,
    validate: {
      isIn: Object.keys(descriptionMap),
    },
  },
}, {
  timestamps: true,
});
