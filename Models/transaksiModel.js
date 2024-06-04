const db = require('../Database/database');
const { DataTypes } = require('sequelize');
const { Kost } = require('./kostModel');
const User = require('./userModel');

const Transaksi = db.define(
  'tbl_transaksi',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_kost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jumlah_uang_dibayarkan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted'),
      defaultValue: 'pending',
      allowNull: false,
    },
    dibayarkan_oleh: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Transaksi.belongsTo(Kost, { as: 'kost', foreignKey: 'id_kost' });
Transaksi.belongsTo(User, { as: 'riwayat_transaksi', foreignKey: 'id_user' });

module.exports = Transaksi;
