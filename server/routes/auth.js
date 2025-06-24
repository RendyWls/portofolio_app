const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { resetPassword } = require("../controllers/authController");

router.post("/reset-password/:token", resetPassword);

// Signup, login, forgot password
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);

// Get & update profile
router.get("/profile/:username", authController.getProfile);
router.put("/profile/:username", authController.updateProfile);

module.exports = router;
