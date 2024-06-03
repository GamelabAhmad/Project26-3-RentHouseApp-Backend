const Rating = require('../Models/ratingModel');
const { Kost } = require('../Models/kostModel');
const User = require('../Models/userModel');
const Transaksi = require('../Models/transaksiModel');
const jwt = require('jsonwebtoken');

const createRating = async (req, res) => {
  try {
    const { id_kost, rating, review } = req.body;
    const id_user = jwt.decode(req.cookies.token).id;

    const transaction = await Transaksi.findOne({
      where: {
        id_user: id_user,
        id_kost: id_kost,
        status: 'accepted',
      },
    });

    if (!transaction) {
      return res.status(403).json({ message: 'Anda belum bisa melakukan rating' });
    }

    const newRating = await Rating.create({
      id_user: id_user,
      id_kost: id_kost,
      rating: rating,
      review: review,
    });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRatingByKostId = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findAll({
      where: { id_kost: id },
      include: [{ model: User, attributes: ['username'] }],
    });

    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRating,
  getRatingByKostId,
};
