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
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomor_telp: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM('pemilik', 'penyewa', 'admin'),
      defaultValue: 'penyewa',
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = User;
