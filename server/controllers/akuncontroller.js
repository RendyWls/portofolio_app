const Akun = require("../models/akunmodel");

// Buat akun baru
exports.createAkun = async (req, res) => {
  const { namaAkun, saldoAwal } = req.body;
  try {
    const akunBaru = new Akun({ namaAkun, saldoAwal });
    await akunBaru.save();
    res.status(201).json(akunBaru);
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan akun", error: err.message });
  }
};

// Ambil semua akun
exports.getAllAkun = async (req, res) => {
  try {
    const akunList = await Akun.find();
    res.status(200).json(akunList);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil akun", error: err.message });
  }
};
