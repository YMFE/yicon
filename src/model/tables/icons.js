/* eslint new-cap: ["error", { "capIsNewExceptions": ["STRING"] }] */
import { seq, Seq } from './_db';

export default seq.define('icons', {
  name: {
    type: Seq.STRING,
    allowNull: false,
    comment: '图标名称',
  },
  fontClass: {
    type: Seq.STRING,
    comment: '图标类名',
  },
  tags: {
    type: Seq.STRING(2000),
    comment: '图标标签',
  },
  code: {
    type: Seq.INTEGER,
    comment: '图标编码e000-f8ff',
  },
  path: {
    type: Seq.STRING(5000),
    allowNull: false,
    comment: 'svg路径信息',
  },
  createTime: {
    type: Seq.DATE,
    defaultValue: Seq.NOW,
    allowNull: false,
    comment: '图标创建时间',
  },
  applyTime: {
    type: Seq.DATE,
    comment: '图标提交审核时间',
  },
  // 0  - 已上传，用户可编辑
  // 5  - 审核未通过，用户可编辑
  // 10 - 已提交，owner可编辑
  // 15 - 旧版字体，被替换过
  // 20 - 通过审核，入库
  // 25 - 通过审核，入库，新版字体
  // -1 - 逻辑删除
  status: {
    type: Seq.INTEGER,
    defaultValue: 0,
    allowNull: false,
    comment: '图标状态，标记图标是否审核通过',
  },
});
