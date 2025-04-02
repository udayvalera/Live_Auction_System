// src/config/db.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") }); // Load .env from src directory

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});

    console.log(`MongoDB Connected!`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
