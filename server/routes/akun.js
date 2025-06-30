// server/routes/akun.js
const express = require("express");
const router = express.Router();
const Akun = require("../models/akunModel");

// GET semua akun
router.get("/", async (req, res) => {
  try {
    const akun = await Akun.find();
    res.json(akun);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data akun." });
  }
});

// POST buat akun baru
router.post("/", async (req, res) => {
  const { namaAkun, saldoAwal } = req.body;
  if (!namaAkun || saldoAwal === undefined) {
    return res.status(400).json({ message: "Nama akun dan saldo awal diperlukan." });
  }

  try {
    const newAkun = new Akun({ namaAkun, saldoAwal });
    await newAkun.save();
    res.status(201).json({ message: "Akun berhasil dibuat.", akun: newAkun });
  } catch (err) {
    res.status(500).json({ message: "Gagal membuat akun." });
  }
});

// PUT update nama akun (saldo awal tidak bisa diubah)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { namaAkun } = req.body;

  try {
    const akun = await Akun.findById(id);
    if (!akun) return res.status(404).json({ message: "Akun tidak ditemukan." });

    akun.namaAkun = namaAkun || akun.namaAkun;
    await akun.save();

    res.json({ message: "Akun berhasil diperbarui.", akun });
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui akun." });
  }
});

// DELETE akun
router.delete("/:id", async (req, res) => {
  try {
    await Akun.findByIdAndDelete(req.params.id);
    res.json({ message: "Akun berhasil dihapus." });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus akun." });
  }
});

module.exports = router;
