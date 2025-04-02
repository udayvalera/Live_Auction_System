// src/utils/jwtUtils.js
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, "top-secret", {
    expiresIn: "30d",
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, "top-secret");
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
