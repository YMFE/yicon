import { seq, Seq } from './_db';

export default seq.define('users', {
  name: {
    type: Seq.STRING,
    allowNull: false,
  },
  actor: {
    type: Seq.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});
