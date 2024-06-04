const Transaksi = require('../Models/transaksiModel');
const { Kost } = require('../Models/kostModel');
const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');

// Mendapatkan semua transaksi
const getAllTransaksiPending = async (req, res) => {
  const id_user = jwt.decode(req.cookies.token).id;
  try {
    // const kost = await Kost.findAll({ where: { id_user: id_user }, include: [{ model: Transaksi, as: 'transaksi', where: { id_user: id_user } }] });
    // if (kost) {
    //   return res.status(404).json({ error: 'Kost not found' });
    // }
    const kost = await Kost.findAll({
      where: { id_user: id_user },
    });
    if (kost.length === 0) {
      return res.status(404).json({ error: 'Kost not found' });
    }

    const transaksi = await Transaksi.findAll({
      where: { status: 'pending' },
      include: {
        model: Kost,
        as: 'kost',
        attributes: ['id', 'nama_kost'],
        where: { id: kost.map((k) => k.id) },
      },
    });
    if (transaksi.length === 0) {
      return res.status(404).json({ error: 'Transaksi not found' });
    }
    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllTransaksiSuccess = async (req, res) => {
  const id_user = jwt.decode(req.cookies.token).id;
  try {
    const kost = await Kost.findAll({ where: { id_user: id_user } });
    if (kost.length === 0) {
      return res.status(404).json({ error: 'Kost not found' });
    }

    const transaksi = await Transaksi.findAll({
      where: { status: 'success' },
      include: {
        model: Kost,
        as: 'kost',
        attributes: ['id', 'nama_kost'],
        where: { id: kost.map((k) => k.id) },
      },
    });
    if (transaksi.length === 0) {
      return res.status(404).json({ error: 'Transaksi not found' });
    }

    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mendapatkan transaksi berdasarkan ID user
const getTransaksiByIdUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userTransaction = await Transaksi.findAll({
      where: { id_user: id },
      include: [
        { model: Kost, as: 'kost', attributes: ['id', 'nama_kost'] },
        { model: User, as: 'riwayat_transaksi', attributes: ['id', 'username'] },
      ],
    });
    res.status(200).json(userTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Membuat transaksi baru
const createTransaksi = async (req, res) => {
  const id_user = jwt.decode(req.cookies.token).id;
  try {
    const user = await User.findOne({ where: { id: id_user } });
    const { id_kost, jumlah_uang_dibayarkan } = req.body;

    if (!id_kost && !jumlah_uang_dibayarkan) {
      return res.status(400).json({ message: 'data tidak lengkap' });
    }

    const newTransaksi = await Transaksi.create({
      id_user,
      id_kost,
      jumlah_uang_dibayarkan,
      dibayarkan_oleh: user.fullname,
    });

    res.status(201).json(newTransaksi);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Memperbarui transaksi berdasarkan ID
const updateTransaksi = async (req, res) => {
  const { id } = req.body;

  try {
    const transaksi = await Transaksi.findOne({ where: { id: id } });
    if (!transaksi) {
      return res.status(404).json({ message: 'transaksi tidak ditemukan' });
    }

    transaksi.status = 'success';
    await transaksi.save();
    res.status(200).json(transaksi);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTransaksiPending,
  getAllTransaksiSuccess,
  getTransaksiByIdUser,
  createTransaksi,
  updateTransaksi,
};
