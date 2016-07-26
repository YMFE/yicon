import { seq, Seq } from './_db';

export default seq.define('repositories', {
  name: {
    type: Seq.STRING,
    allowNull: false,
    unique: true,
  },
  alias: {
    type: Seq.STRING,
    allowNull: false,
    unique: true,
  },
  notice: {
    type: Seq.STRING,
  },
  updatedAt: {
    type: Seq.DATE,
    defaultValue: Seq.NOW,
    allowNull: false,
  },
});
