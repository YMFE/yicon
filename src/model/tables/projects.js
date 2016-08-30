import { seq, Seq } from './_db';

export default seq.define('projects', {
  name: {
    type: Seq.STRING,
    allowNull: false,
    unique: true,
  },
  info: {
    type: Seq.STRING,
  },
  public: {
    type: Seq.BOOLEAN,
    defaultValue: false,
  },
  baseline: {
    type: Seq.BOOLEAN,
    defaultValue: false,
  },
});
