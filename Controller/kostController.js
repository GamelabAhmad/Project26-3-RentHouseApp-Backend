const { Kost, detailKost } = require('../Models/kostModel');
const jwt = require('jsonwebtoken');
const cloudinary = require('../middleware/cloudinary');

const createKost = async (req, res) => {
  try {
    const id_user = jwt.decode(req.cookies.token).id;
    const { nama_kost, alamat, kota, kecamatan, deskripsi, fasilitas, peraturan, tipe_kost, harga_sewa, jumlah_kamar } = req.body;

    if (!nama_kost || !alamat || !kota || !kecamatan || !deskripsi || !fasilitas || !peraturan || !tipe_kost || !harga_sewa) {
      return res.status(400).json({ message: 'semua kolom harus diisi' });
    }

    const images = req.files; // Menggunakan req.files untuk menangani multiple files
    if (!images || images.length === 0) {
      return res.status(400).json({ message: 'gambar harus ada' });
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg']; // Tipe file gambar yang diizinkan

    // Memeriksa setiap file yang diunggah
    for (const image of images) {
      // Memeriksa tipe file
      if (!validImageTypes.includes(image.mimetype)) {
        return res.status(400).json({ message: 'gambar harus jpg/png/jpeg' });
      }
    }

    const imageUrls = [];

    const uploadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(async (err, result) => {
            if (err) return reject(err);
            resolve(result.url); // Resolving dengan URL gambar yang diperoleh dari Cloudinary
          })
          .end(image.buffer);
      });
    });
    const urls = await Promise.all(uploadPromises);

    const kost = await Kost.create({
      id_user: id_user,
      nama_kost: nama_kost,
      alamat: alamat,
      kota: kota,
      deskripsi: deskripsi,
      kecamatan: kecamatan,
    });

    // Create the detailKost entry using the newly created kost's ID
    const detail = await detailKost.create({
      id_kost: kost.id,
      tipe_kost: tipe_kost,
      harga_sewa: harga_sewa,
      jumlah_kamar: jumlah_kamar,
      fasilitas: fasilitas,
      peraturan: peraturan,
      gambar: urls,
    });

    res.status(201).json({ kost, detail });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getKosts = async (req, res) => {
  try {
    const kosts = await Kost.findAll({
      include: {
        model: detailKost,
        attributes: ['tipe_kost', 'harga_sewa', 'jumlah_kamar', 'fasilitas', 'peraturan', 'gambar'],
        as: 'detail',
      },
    });
    res.status(200).json(kosts);
  } catch (error) {}
};

module.exports = { createKost, getKosts };
