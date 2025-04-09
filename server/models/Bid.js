// models/Bid.js
const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: [true, "Auction reference is required."],
      index: true, // Index for querying bids by auction
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Bidder reference is required."],
      index: true, // Index for querying bids by user
    },
    amount: {
      type: Number,
      required: [true, "Bid amount is required."],
      min: [0.01, "Bid amount must be positive."], // Assuming bids must be at least 1 cent/unit
    },
    // timestamps: true will add createdAt and updatedAt automatically
  },
  {
    timestamps: true, // Adds createdAt (timestamp of bid) and updatedAt
  }
);

// Optional: Compound index if you frequently query bids for an auction sorted by time
BidSchema.index({ auction: 1, createdAt: -1 });

// Prevent a user from placing identical consecutive bids (less common need, but possible)
// BidSchema.index({ auction: 1, bidder: 1, amount: 1 }, { unique: true }); // Use with caution

const Bid = mongoose.model("Bid", BidSchema);

module.exports = Bid;
