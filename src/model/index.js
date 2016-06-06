import User from './tables/users';
import Icon from './tables/icons';
import Log from './tables/logs';
import Project from './tables/projects';
import Repo from './tables/repositories';
import { seq, Seq } from './tables/_db';

const versionAttribute = {
  version: {
    type: Seq.INTEGER,
    get() {
      return (this.getDataValue('version') / 1000000)
        .toFixed(6)
        .match(/\d{2}/g)
        .map(d => +d)
        .join('.');
    },
    set(val) {
      this.setDataValue(
        'version',
        val.split('.')
          .reduce((p, n, i) => p + n * Math.pow(100, 2 - i), 0)
      );
    },
  },
};

const ProjectVersion = seq.define('projectVersions', versionAttribute);
const RepoVersion = seq.define('repoVersion', versionAttribute);

const UserProject = seq.define('userProject');
const UserLog = seq.define('userLog', {
  unread: {
    type: Seq.BOOLEAN,
    default: true,
  },
});

// 两边都写一下对应关系，以便添加 dao 方法
Icon.hasOne(Icon, { as: 'Replacer', foreignKey: 'replaceId' });
Icon.belongsToMany(Repo, { through: RepoVersion });
Icon.belongsToMany(Project, { through: ProjectVersion });

Repo.belongsToMany(Icon, { through: RepoVersion });
Repo.belongsTo(User, { foreignKey: 'admin' });

Project.belongsToMany(Icon, { through: ProjectVersion });

User.hasMany(Icon, { foreignKey: 'uploader' });
User.hasMany(Repo, { foreignKey: 'admin' });
User.hasMany(Log, { foreignKey: 'operator' });
User.hasMany(Project, { foreignKey: 'owner' });
User.belongsToMany(Project, { through: UserProject });

Log.belongsTo(Repo, { foreignKey: 'rpId' });
Log.belongsTo(Project, { foreignKey: 'rpId' });
Log.belongsToMany(User, { through: UserLog });

export { seq, Seq, User, Icon, Log, Project, Repo, RepoVersion };
