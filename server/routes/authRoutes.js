// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyUserToken,
  updateUserProfilePicture,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware"); // Import both middleware functions

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-token", protect, verifyUserToken);
router.patch("/profile-picture", protect, updateUserProfilePicture);

module.exports = router;
