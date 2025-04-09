require("dotenv").config();
const express = require("express");
const app = express();

// --- Configurations ---
const connectDB = require("./config/db");
const cors = require("cors");
const PORT = 5001;
connectDB(); // Connect to MongoDB
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- Routes ---
const auctionRoutes = require("./routes/auctionRoutes");
const authRoutes = require("./routes/authRoutes");
const bidRoutes = require("./routes/bidRoutes"); // Assuming you have this route

// --- Test Route ---
app.get("/", (req, res) => {
  res.send({
    message: "Hello World",
  });
});

// --- API Routes ---
app.use("/api/auth/", authRoutes);
app.use("/api/auctions/", auctionRoutes);
app.use("/api/bids/", bidRoutes);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
