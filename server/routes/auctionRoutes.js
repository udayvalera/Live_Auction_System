// routes/auctionRoutes.js
const express = require("express");
const {
  createAuction,
  listAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
  toggleLikeAuction,
  getMyAuctions,
  getLikedAuctions,
} = require("../controllers/auctionController");
const { protect } = require("../middleware/authMiddleware"); // Import authentication middleware

const router = express.Router();

// --- Public Routes ---

/**
 * @route   GET /api/v1/auctions
 * @desc    Get list of auctions with filtering, sorting, pagination
 * @access  Public
 */
router.get("/", listAuctions);

/**
 * @route   GET /api/v1/auctions/:id
 * @desc    Get single auction details by ID
 * @access  Public
 */
router.get("/:id", getAuctionById);

// --- Private Routes (Require Authentication) ---

/**
 * @route   POST /api/v1/auctions
 * @desc    Create a new auction
 * @access  Private
 */
router.post("/", protect, createAuction);

/**
 * @route   PUT /api/v1/auctions/:id
 * @desc    Update an auction (Seller or Admin only - controller handles authorization)
 * @access  Private
 */
router.put("/:id", protect, updateAuction);

/**
 * @route   DELETE /api/v1/auctions/:id
 * @desc    Delete an auction (Seller or Admin only - controller handles authorization)
 * @access  Private
 */
router.delete("/:id", protect, deleteAuction);

/**
 * @route   PATCH /api/v1/auctions/:id/like
 * @desc    Like or unlike an auction
 * @access  Private
 */
router.patch("/:id/like", protect, toggleLikeAuction);

/**
 * @route   GET /api/v1/auctions/my-auctions
 * @desc    Get auctions created by the logged-in user
 * @access  Private
 */
// IMPORTANT: Place specific routes like '/my-auctions' BEFORE dynamic routes like '/:id'
router.get("/my-auctions", protect, getMyAuctions);

/**
 * @route   GET /api/v1/auctions/liked-auctions
 * @desc    Get auctions liked by the logged-in user
 * @access  Private
 */
// IMPORTANT: Place specific routes like '/liked-auctions' BEFORE dynamic routes like '/:id'
router.get("/liked-auctions", protect, getLikedAuctions);

module.exports = router;
