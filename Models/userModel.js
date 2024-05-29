const { DataTypes } = require('sequelize');
const db = require('../Database/database');

const User = db.define(
  'tbl_user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomor_telp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM('pemilik', 'penyewa', 'admin'),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = User;
