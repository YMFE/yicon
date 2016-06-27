/* eslint new-cap: ["error", { "capIsNewExceptions": ["STRING"] }] */

import { seq, Seq } from './_db';

// TODO: 思考一下模板放到哪儿比较合适（或许是全局）
const descriptionMap = {
  UPLOAD: '',
  AUDIT_OK: '',
  AUDIT_FAILED: '',
  REPO_VERSION: '',
  REPLACE: '',
  PROJECT_DEL: '',
  PROJECT_EDIT: '',
  PROJECT_ADD: '',
  PROJECT_MEMBER: '',
  PROJECT_VERSION: '',
  REPO_ADMIN: '',
  PROJECT_OWNER: '',
};

export default seq.define('logs', {
  type: {
    type: Seq.STRING,
    allowNull: false,
    validate: {
      isIn: Object.keys(descriptionMap),
    },
  },
  operation: {
    type: Seq.STRING(1000),
    allowNull: false,
  },
}, {
  timestamps: true,
});
