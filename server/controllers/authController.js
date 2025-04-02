// src/controllers/authControllers.js
const User = require("../models/User");
const { generateToken, verifyToken } = require("../utils/jwtUtils");
const randomAvatarGenerator = require("../utils/avatar");
const bcrypt = require("bcrypt");

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate profile picture URL
    const profilePictureUrl = randomAvatarGenerator();

    // Create new user
    const user = new User({
      name,
      email,
      password,
      profilePictureUrl,
    });

    await user.save();

    // Generate JWT
    const token = generateToken({ userId: user._id, isAdmin: user.isAdmin });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePictureUrl: user.profilePictureUrl,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user and return JWT
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password"); // Important to select password here.

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login time
    await user.updateLastLogin();

    // Generate JWT
    const token = generateToken({ userId: user._id, isAdmin: user.isAdmin });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePictureUrl: user.profilePictureUrl,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify token and return user data
// @route GET /api/auth/verify-token
// @access Private
const verifyUserToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePictureUrl: user.profilePictureUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile picture
// @route PATCH /api/auth/profile-picture
// @access Private
const updateUserProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profilePictureUrl = randomAvatarGenerator();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePictureUrl: profilePictureUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: updatedUser._id,
      profilePictureUrl: updatedUser.profilePictureUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyUserToken,
  updateUserProfilePicture,
};
