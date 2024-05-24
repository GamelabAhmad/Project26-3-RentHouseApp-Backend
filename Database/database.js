const { Sequelize } = require("sequelize");

const db = new Sequelize("rent_house", "postgres", "12345", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = db;
