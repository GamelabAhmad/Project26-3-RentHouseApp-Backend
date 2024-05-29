const { Sequelize } = require('sequelize');

const db = new Sequelize('rent_house', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '+07:00',
  dialectOptions: {
    dateStrings: true,
    useUTC: false,
    typeCast: function (field, next) {
      if (field.type === 'DATETIME') {
        return field.string();
      }
      return next();
    },
  },
});

module.exports = db;
