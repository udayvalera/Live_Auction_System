// routes/bidRoutes.js
const express = require("express");
const bidController = require("../controllers/bidController");
const { protect } = require("../middleware/authMiddleware"); // Assuming you have this auth middleware

const router = express.Router({ mergeParams: true }); // mergeParams allows access to :auctionId from parent router

// --- Place a bid on a specific auction ---
// POST /api/bids/
router.post("/", protect, bidController.placeBid);

// --- Get all bids for a specific auction ---
// GET /api/bids/
router.get("/", bidController.getBidsForAuction);

// --- Get a specific bid for an auction ---
// GET /api/bids/me
router.get("/me", protect, bidController.getMyBids);

module.exports = router; // Export the router designed for /api/auctions/:auctionId/bids
