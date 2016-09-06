import { seq, Seq } from './_db';

export default seq.define('repositories', {
  name: {
    type: Seq.STRING,
    allowNull: false,
    unique: true,
    comment: '大库名称',
  },
  alias: {
    type: Seq.STRING,
    allowNull: false,
    unique: true,
    comment: '大库别名，用户生成图标的类名前缀',
  },
  notice: {
    type: Seq.STRING,
    comment: '大库公告，废置',
  },
  updatedAt: {
    type: Seq.DATE,
    defaultValue: Seq.NOW,
    allowNull: false,
    comment: '更新时间，用户在生成字体时进行比对',
  },
});
