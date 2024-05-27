const db = require('../Database/database');
const { DataTypes } = require('sequelize');
const User = require('./userModel');

const Kost = db.define(
  'tbl_kost',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_user',
        key: 'id',
      },
    },
    nama_kost: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    kota: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kecamatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const detailKost = db.define(
  'tbl_detailkost',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_kost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_kost',
        key: 'id',
      },
    },
    tipe_kost: {
      type: DataTypes.ENUM('Putra', 'Putri', 'Campur'),
      allowNull: false,
    },
    harga_sewa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jumlah_kamar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fasilitas: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    peraturan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gambar: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Kost.belongsTo(User, { foreignKey: 'id_user' });
Kost.hasOne(detailKost, { as: 'detail', foreignKey: 'id_kost' });

module.exports = { Kost, detailKost };
