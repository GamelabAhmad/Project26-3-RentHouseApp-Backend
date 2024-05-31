const Transaksi = require('../Models/transaksiModel');
const Kost = require('../Models/kostModel');
const User = require('../Models/userModel');

// Mendapatkan semua transaksi
const getAllTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findAll({
      include: [
        { model: Kost, as: 'kost' },
        { model: User, as: 'riwayat_transaksi' },
      ],
    });
    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mendapatkan transaksi berdasarkan ID
const getTransaksiById = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.id, {
      include: [
        { model: Kost, as: 'kost' },
        { model: User, as: 'riwayat_transaksi' },
      ],
    });
    if (!transaksi) {
      return res.status(404).json({ error: 'Transaksi not found' });
    }
    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Membuat transaksi baru
const createTransaksi = async (req, res) => {
  try {
    const { id_user, id_kost, jumlah_uang_dibayarkan, tanggal_bayar, status, dibayarkan_oleh } = req.body;

    const newTransaksi = await Transaksi.create({
      id_user,
      id_kost,
      jumlah_uang_dibayarkan,
      tanggal_bayar,
      status,
      dibayarkan_oleh,
    });

    res.status(201).json(newTransaksi);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};

// Memperbarui transaksi berdasarkan ID
const updateTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.id);
    if (!transaksi) {
      return res.status(404).json({ error: 'Transaksi not found' });
    }

    const { id_user, id_kost, jumlah_uang_dibayarkan, tanggal_bayar, status, dibayarkan_oleh } = req.body;

    transaksi.id_user = id_user;
    transaksi.id_kost = id_kost;
    transaksi.jumlah_uang_dibayarkan = jumlah_uang_dibayarkan;
    transaksi.tanggal_bayar = tanggal_bayar;
    transaksi.status = status;
    transaksi.dibayarkan_oleh = dibayarkan_oleh;

    await transaksi.save();

    res.json(transaksi);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};

// Menghapus transaksi berdasarkan ID
const deleteTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.id);
    if (!transaksi) {
      return res.status(404).json({ error: 'Transaksi not found' });
    }

    await transaksi.destroy();
    res.json({ message: 'Transaksi deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllTransaksi,
  getTransaksiById,
  createTransaksi,
  updateTransaksi,
  deleteTransaksi
};
