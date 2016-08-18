/*
 * Copy this file to ./sscce.js
 * Add code from issue
 * npm run sscce-{dialect}
 */

var Sequelize;
var DataTypes = Sequelize = require('./index');
var sequelize = require('./test/support').createSequelizeInstance({
  logging: console.log
});
var Promise = sequelize.Promise;

const User = sequelize.define('userz', {
  date: Sequelize.DATEONLY
});


return sequelize.sync({
  force: true,
  logging: console.log
})
  .then(() => {
    return User.create({
      date: '2016-08-10'
    });
  })
  .then(() => User.findAll().get(0))
  .then(u => console.log(u.get()))
  .finally(() => sequelize.close());
