// controllers/bidController.js
const mongoose = require("mongoose");
const Bid = require("../models/Bid");
const Auction = require("../models/Auction");
const User = require("../models/User"); // Optional: if needed for further checks

// --- Helper Function for Error Handling ---
const handleServerError = (
  res,
  error,
  message = "An internal server error occurred."
) => {
  console.error(error);
  // Avoid sending detailed Mongoose/DB errors to the client in production
  const errorMessage =
    process.env.NODE_ENV === "production" ? message : error.message;
  res
    .status(500)
    .json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV !== "production" ? error : undefined,
    });
};

// --- Place a New Bid ---
exports.placeBid = async (req, res) => {
  const { auctionId } = req.params;
  const { amount } = req.body;
  const bidderId = req.user.id; // Assuming auth middleware adds user info to req.user

  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Auction ID format." });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid bid amount. Must be a positive number.",
      });
  }

  // Use a transaction for atomicity: create Bid record AND update Auction together
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find the auction within the transaction
    const auction = await Auction.findById(auctionId).session(session);

    // 2. Perform Validations
    if (!auction) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Auction not found." });
    }

    if (auction.seller.toString() === bidderId) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(403)
        .json({
          success: false,
          message: "Sellers cannot bid on their own auctions.",
        });
    }

    const auctionStatus = auction.status; // Use the virtual getter
    if (auctionStatus !== "active" && auctionStatus !== "ending-soon") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({
          success: false,
          message: `Auction is not active. Status: ${auctionStatus}`,
        });
    }

    if (amount <= auction.currentBid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Your bid must be higher than the current bid of ${auction.currentBid}.`,
        currentBid: auction.currentBid, // Send current bid for frontend context
      });
    }

    // Check against starting bid if it's the first bid potentially
    if (auction.bidCount === 0 && amount < auction.startingBid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `The first bid must be at least the starting bid of ${auction.startingBid}.`,
        startingBid: auction.startingBid,
      });
    }

    // 3. Update the Auction within the transaction
    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      {
        $set: {
          currentBid: amount,
          highestBidder: bidderId,
        },
        $inc: { bidCount: 1 },
      },
      { new: true, session: session } // Return the updated document, use session
    );

    if (!updatedAuction) {
      // Should not happen if auction was found initially, but check defensively
      throw new Error("Failed to update auction during bid placement.");
    }

    // 4. Create the Bid record within the transaction
    const newBid = new Bid({
      auction: auctionId,
      bidder: bidderId,
      amount: amount,
    });
    await newBid.save({ session: session });

    // 5. Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // --- Optional: Emit WebSocket event for real-time update ---
    // if (req.io) { // Assuming io is attached to req object
    //   req.io.to(auctionId).emit('new_bid', {
    //     auctionId: auctionId,
    //     bidderId: bidderId,
    //     bidderName: req.user.name, // Get name from auth middleware if available
    //     amount: amount,
    //     bidCount: updatedAuction.bidCount,
    //     timestamp: newBid.createdAt
    //   });
    // }

    // 6. Send Response
    res.status(201).json({
      success: true,
      message: "Bid placed successfully!",
      bid: newBid, // Send the created bid details
      auction: {
        // Send updated auction state
        _id: updatedAuction._id,
        currentBid: updatedAuction.currentBid,
        highestBidder: updatedAuction.highestBidder,
        bidCount: updatedAuction.bidCount,
      },
    });
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    handleServerError(res, error, "Failed to place bid due to a server error.");
  }
};

// --- Get Bids for a Specific Auction ---
exports.getBidsForAuction = async (req, res) => {
  const { auctionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Auction ID format." });
  }

  try {
    // Optional: Check if auction exists first
    const auctionExists = await Auction.findById(auctionId).select("_id");
    if (!auctionExists) {
      return res
        .status(404)
        .json({ success: false, message: "Auction not found." });
    }

    // Find bids, populate bidder info (select only needed fields), sort by newest first
    const bids = await Bid.find({ auction: auctionId })
      .populate("bidder", "name profilePictureUrl _id") // Select non-sensitive bidder fields
      .sort({ createdAt: -1 }); // Newest bids first

    res.status(200).json({
      success: true,
      count: bids.length,
      bids: bids,
    });
  } catch (error) {
    handleServerError(res, error, "Failed to retrieve bids.");
  }
};

// --- Get Bids Placed by the Logged-in User ---
exports.getMyBids = async (req, res) => {
  const userId = req.user.id; // From auth middleware

  try {
    const bids = await Bid.find({ bidder: userId })
      .populate({
        // Populate auction details
        path: "auction",
        select: "title imageUrl endTime currentBid status highestBidder", // Select desired fields
      })
      .sort({ createdAt: -1 }); // Show user's most recent bids first

    // Optionally, add auction status or if the user is the current highest bidder
    const bidsWithStatus = bids.map((bid) => {
      const bidObj = bid.toObject(); // Convert Mongoose doc to plain object
      if (bidObj.auction) {
        // Check if auction was populated successfully
        bidObj.isHighestBidder =
          bidObj.auction.highestBidder?.toString() === userId;
        // Keep auction status from virtual if needed (it's already there if populated)
      } else {
        bidObj.isHighestBidder = false; // Auction data might be missing if deleted etc.
      }
      return bidObj;
    });

    res.status(200).json({
      success: true,
      count: bidsWithStatus.length,
      bids: bidsWithStatus,
    });
  } catch (error) {
    handleServerError(res, error, "Failed to retrieve your bids.");
  }
};
