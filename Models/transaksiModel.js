const db = require('../Database/database');
const { DataTypes } = require('sequelize');
const { Kost } = require('./kostModel');
const User = require('./userModel');

const Transaksi = db.define(
  'tbl_transaksi',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    id_kost: {
      type: DataTypes.INTEGER,
    },
    nama_kost: {
      type: DataTypes.STRING,
    },
    total: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM('PENDING_PAYMENT', 'PAID', 'CANCELED'),
      defaultValue: 'PENDING_PAYMENT',
    },
    customer_name: {
      type: DataTypes.STRING,
    },
    customer_email: {
      type: DataTypes.STRING,
    },
    snap_token: {
      type: DataTypes.STRING,
    },
    snap_redirect_url: {
      type: DataTypes.STRING,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Transaksi.belongsTo(Kost, { as: 'kost', foreignKey: 'id_kost' });

module.exports = { Transaksi };
