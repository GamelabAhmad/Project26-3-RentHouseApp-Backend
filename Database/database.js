const { Sequelize } = require('sequelize');

const db = new Sequelize('rent_house', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = db;
