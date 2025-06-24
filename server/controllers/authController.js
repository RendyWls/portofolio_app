// server/controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer");

exports.signup = async (req, res) => {
  const { email, username, dateOfBirth, password } = req.body;

  try {
    // Cek username/email sudah ada
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: "Email atau username sudah terdaftar." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      dateOfBirth,
      passwordHash,
    });

    await newUser.save();
    res.status(201).json({ message: "Akun berhasil dibuat." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal registrasi." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "Jika email terdaftar, link reset akan dikirim." });
    }

    // Buat token dan set masa berlaku 1 jam
    const token = Math.random().toString(36).substring(2);
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 jam dari sekarang
    await user.save();

    // Konfigurasi transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Kirim email reset
    const resetUrl = `http://127.0.0.1:5500/admin/reset-password.html?token=${token}`;

    await transporter.sendMail({
      from: `"Portofolio App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Reset Password",
      html: `
        <p>Halo,</p>
        <p>Anda meminta reset password. Klik tautan di bawah ini untuk mengatur ulang password Anda:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
        <p>Abaikan email ini jika Anda tidak meminta reset password.</p>
      `,
    });

    res.status(200).json({ message: "Link reset dikirim ke email (jika terdaftar)." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengirim email." });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || username.length < 6) {
      return res.status(400).json({ message: "Username tidak valid." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Username tidak ditemukan." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah." });
    }

    res.status(200).json({ message: "Login berhasil!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal login." });
  }
};

// Ambil profil user
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      email: user.email,
      username: user.username,
      dateOfBirth: user.dateOfBirth, // ← HARUS `dateOfBirth`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profil user
exports.updateProfile = async (req, res) => {
  const { username } = req.params;
  const { email, username: newUsername, dob } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate({ username }, { email, username: newUsername, dob }, { new: true });

    if (!updatedUser) return res.status(404).json({ message: "User tidak ditemukan" });

    res.json({ message: "Profil diperbarui", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui profil" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });

    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password berhasil direset." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat mereset password." });
  }
};
