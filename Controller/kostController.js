const { Kost, detailKost } = require('../Models/kostModel');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const cloudinary = require('../middleware/cloudinary');

const createKost = async (req, res) => {
  const id_user = jwt.decode(req.cookies.token).id;
  const nama = jwt.decode(req.cookies.token).fullname;
  const { nama_kost, alamat, kota, kecamatan, deskripsi, fasilitas, peraturan, tipe_kost, harga_sewa, jumlah_kamar } = req.body;

  try {
    if (!nama_kost || !alamat || !kota || !kecamatan || !deskripsi || !fasilitas || !peraturan || !tipe_kost || !harga_sewa || !jumlah_kamar) {
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
    const publicIds = [];

    const transaction = await Kost.sequelize.transaction();
    try {
      const kost = await Kost.create(
        {
          id_user: id_user,
          nama_kost: nama_kost,
          alamat: alamat,
          kota: kota,
          deskripsi: deskripsi,
          kecamatan: kecamatan,
          created_by: nama,
        },
        { transaction }
      );

      // Jika kost tidak berhasil dibuat, batalkan transaksi
      if (!kost) {
        await transaction.rollback();
        return res.status(500).json({ message: 'Kost tidak berhasil dibuat' });
      }

      // Mengunggah gambar
      const uploadPromises = images.map((image) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ transformation: { quality: 'auto' } }, (err, result) => {
              if (err) return reject(err);
              imageUrls.push(result.url);
              publicIds.push(result.public_id);
              resolve();
            })
            .end(image.buffer);
        });
      });

      await Promise.all(uploadPromises);

      await detailKost.create(
        {
          id_kost: kost.id,
          tipe_kost: tipe_kost,
          harga_sewa: harga_sewa,
          jumlah_kamar: jumlah_kamar,
          fasilitas: fasilitas,
          peraturan: peraturan,
          gambar: imageUrls,
          public_id: publicIds,
        },
        { transaction }
      );

      await transaction.commit();

      res.status(201).json({ message: 'kost berhasil dibuat' });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
    if (kosts.length === 0) {
      return res.status(404).json({ message: 'kost tidak ditemukan' });
    }
    res.status(200).json(kosts);
  } catch (error) {
    res.status(500).json({ message: 'Status error' });
  }
};

const getKostsById = async (req, res) => {
  try {
    const { id } = req.params;
    const kosts = await Kost.findOne({
      where: { id: id },
      include: {
        model: detailKost,
        attributes: ['tipe_kost', 'harga_sewa', 'jumlah_kamar', 'fasilitas', 'peraturan', 'gambar'],
        as: 'detail',
      },
    });
    if (!kosts) {
      return res.status(404).json({ message: 'kost tidak ditemukan' });
    }

    res.status(200).json(kosts);
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};

const searchKosts = async (req, res) => {
  try {
    const { q } = req.query;
    const kosts = await Kost.findAll({
      where: {
        [Op.or]: [{ nama_kost: { [Op.like]: `%${q}%` } }, { alamat: { [Op.like]: `%${q}%` } }, { kota: { [Op.like]: `%${q}%` } }, { kecamatan: { [Op.like]: `%${q}%` } }],
      },
      include: {
        model: detailKost,
        attributes: ['tipe_kost', 'harga_sewa', 'jumlah_kamar', 'fasilitas', 'peraturan', 'gambar'],
        as: 'detail',
      },
    });
    if (kosts.length === 0) {
      return res.status(404).json({ message: 'kost tidak ditemukan' });
    }

    res.status(200).json(kosts);
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};

const updateKosts = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kost, alamat, kota, kecamatan, deskripsi, fasilitas, peraturan, tipe_kost, harga_sewa, jumlah_kamar } = req.body;
    const kost = await Kost.findOne({ where: { id: id } });
    if (!kost) {
      return res.status(404).json({ message: 'kost tidak ditemukan' });
    }
    const detail = await detailKost.findOne({ where: { id_kost: kost.id } });
    if (!detail) {
      return res.status(404).json({ message: 'detail kost tidak ditemukan' });
    }

    kost.nama_kost = nama_kost || kost.nama_kost;
    kost.alamat = alamat || kost.alamat;
    kost.kota = kota || kost.kota;
    kost.deskripsi = deskripsi || kost.deskripsi;
    kost.kecamatan = kecamatan || kost.kecamatan;

    detail.fasilitas = fasilitas || detail.fasilitas;
    detail.peraturan = peraturan || detail.peraturan;
    detail.tipe_kost = tipe_kost || detail.tipe_kost;
    detail.harga_sewa = harga_sewa || detail.harga_sewa;
    detail.jumlah_kamar = jumlah_kamar || detail.jumlah_kamar;

    await kost.save();
    await detail.save();
    res.status(200).json({ msg: 'kost berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'server Error' });
  }
};

const deleteKosts = async (req, res) => {
  try {
    const { id } = req.params;
    const kost = await Kost.findOne({ where: { id: id } });
    if (!kost) {
      return res.status(404).json({ message: 'kost tidak ditemukan' });
    }

    const detail = await detailKost.findOne({ where: { id_kost: kost.id } });

    if (detail) {
      detail.public_id.map(async (public_id) => {
        // Menggunakan cloudinary.uploader.destroy untuk menghapus gambar dari Cloudinary
        await cloudinary.uploader.destroy(public_id, (error, result) => {
          if (error) {
            console.error(error);
          }
        });
      });
      await detail.destroy();
    }

    await kost.destroy();
    res.status(200).json({ msg: 'kost berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'server Error' });
  }
};

module.exports = { createKost, getKosts, getKostsById, searchKosts, updateKosts, deleteKosts };
