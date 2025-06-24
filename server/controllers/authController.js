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
    if (!user) return res.status(200).json({ message: "Jika email terdaftar, link reset akan dikirim." });

    const token = Math.random().toString(36).substring(2);
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 jam
    await user.save();

    // Kirim email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portofolio App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Reset Password",
      html: `<p>Silakan klik link berikut untuk reset password:</p>
             <a href="http://localhost:5000/reset-password/${token}">Reset Password</a>`,
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
