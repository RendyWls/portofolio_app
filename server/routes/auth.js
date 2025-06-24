// server/routes/auth.js
const express = require("express");
const router = express.Router();
const { signup, forgotPassword, login } = require("../controllers/authController");

// POST /api/auth/signup
router.post("/signup", signup);
router.post("/login", login);

// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

module.exports = router;
