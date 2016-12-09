import { seq, Seq } from './_db';

export default seq.define('users', {
  name: {
    type: Seq.STRING,
    allowNull: false,
    comment: '用户名称',
  },
  actor: {
    type: Seq.INTEGER,
    defaultValue: 0,
    allowNull: false,
    comment: '用户角色，0-普通1-库管2-超管',
  },
});
