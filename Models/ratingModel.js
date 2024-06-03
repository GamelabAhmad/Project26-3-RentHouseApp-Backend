const db = require('../Database/database');
const { DataTypes } = require('sequelize');
const { Kost } = require('./kostModel');
const User = require('./userModel');

const Rating = db.define(
  'tbl_rating',
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    review: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

User.hasMany(Rating, { foreignKey: 'id_user' });
Kost.hasMany(Rating, { foreignKey: 'id_kost' });
Rating.belongsTo(Kost, { as: 'rating_kost', foreignKey: 'id_kost' });
Rating.belongsTo(User, { as: 'rating_user', foreignKey: 'id_user' });

module.exports = Rating;
