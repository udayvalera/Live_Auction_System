// controllers/auctionController.js

const mongoose = require("mongoose");
const Auction = require("../models/Auction");
const User = require("../models/User");

// --- Helper Function (Optional) ---
const parseQueryOptions = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit =
    parseInt(query.limit, 10) ||
    parseInt(process.env.DEFAULT_PAGE_LIMIT || "10", 10);
  const skip = (page - 1) * limit;

  const sortOptions = {};
  if (query.sortBy) {
    sortOptions[query.sortBy] = query.sortOrder === "desc" ? -1 : 1;
  } else {
    sortOptions.endTime = 1; // Default: ending soonest
  }

  return { page, limit, skip, sortOptions };
};

// --- Controller Methods ---

/**
 * @description Create a new auction
 * @route POST /api/v1/auctions
 * @access Private (Requires login)
 */
const createAuction = async (req, res, next) => {
  try {
    const {
      title,
      description,
      startingBid,
      endTime,
      startTime,
      imageUrl,
      images,
      category,
      location,
      documents,
    } = req.body;
    const sellerId = req.user.id; // From authentication middleware

    // Basic Validation
    if (!title || !description || startingBid === undefined || !endTime) {
      const error = new Error(
        "Missing required auction fields (title, description, startingBid, endTime)"
      );
      error.statusCode = 400;
      return next(error); // Use return to stop execution here
    }

    const now = new Date();
    const auctionStartTime = startTime ? new Date(startTime) : now;
    const auctionEndTime = new Date(endTime);

    if (auctionEndTime <= auctionStartTime) {
      const error = new Error("End time must be after start time");
      error.statusCode = 400;
      return next(error);
    }
    if (auctionEndTime <= now && auctionStartTime <= now) {
      const error = new Error("End time must be in the future");
      error.statusCode = 400;
      return next(error);
    }

    const newAuction = new Auction({
      title,
      description,
      startingBid,
      endTime: auctionEndTime,
      startTime: auctionStartTime,
      imageUrl,
      images,
      category,
      location,
      documents,
      seller: sellerId,
      currentBid: startingBid, // Initialize currentBid
    });

    await newAuction.save();
    await newAuction.populate("seller", "fullName profilePictureUrl");

    res.status(201).json({
      success: true,
      message: "Auction created successfully",
      data: newAuction,
    });
  } catch (error) {
    // Handle Mongoose validation errors specifically
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      const validationError = new Error(
        `Validation Error: ${messages.join(", ")}`
      );
      validationError.statusCode = 400;
      return next(validationError); // Use return
    }
    // For other errors, add a default status code if none exists
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error); // Pass to global error handler
  }
};

/**
 * @description Get list of auctions with filtering, sorting, pagination
 * @route GET /api/v1/auctions
 * @access Public
 */
const listAuctions = async (req, res, next) => {
  try {
    const { page, limit, skip, sortOptions } = parseQueryOptions(req.query);
    const filter = {};
    const now = new Date();

    // --- Filtering ---
    if (req.query.category) filter.category = req.query.category;
    if (req.query.sellerId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.sellerId)) {
        const error = new Error("Invalid seller ID format");
        error.statusCode = 400;
        return next(error);
      }
      filter.seller = req.query.sellerId;
    }
    if (req.query.minPrice)
      filter.currentBid = {
        ...filter.currentBid,
        $gte: parseFloat(req.query.minPrice),
      };
    if (req.query.maxPrice)
      filter.currentBid = {
        ...filter.currentBid,
        $lte: parseFloat(req.query.maxPrice),
      };

    // Status filtering
    if (req.query.status) {
      switch (req.query.status) {
        case "upcoming":
          filter.startTime = { $gt: now };
          if (!req.query.sortBy) sortOptions = { startTime: 1 };
          break;
        case "active":
        case "ending-soon":
          filter.startTime = { $lte: now };
          filter.endTime = { $gt: now };
          if (!req.query.sortBy) sortOptions = { endTime: 1 };
          break;
        case "ended":
          filter.endTime = { $lte: now };
          if (!req.query.sortBy) sortOptions = { endTime: -1 };
          break;
      }
    } else {
      filter.startTime = { $lte: now };
      filter.endTime = { $gt: now };
      if (!req.query.sortBy) sortOptions = { endTime: 1 };
    }

    // Search term
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }
    // --- End Filtering ---

    const auctions = await Auction.find(filter)
      .populate("seller", "fullName profilePictureUrl")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalAuctions = await Auction.countDocuments(filter);
    const totalPages = Math.ceil(totalAuctions / limit);

    res.status(200).json({
      success: true,
      count: auctions.length,
      pagination: { totalAuctions, totalPages, currentPage: page, limit },
      data: auctions,
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

/**
 * @description Get single auction details by ID
 * @route GET /api/v1/auctions/:id
 * @access Public
 */
const getAuctionById = async (req, res, next) => {
  try {
    const auctionId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      const error = new Error("Invalid auction ID format");
      error.statusCode = 400;
      return next(error);
    }

    const auction = await Auction.findById(auctionId)
      .populate("seller", "fullName profilePictureUrl email")
      .populate("highestBidder", "fullName");

    if (!auction) {
      const error = new Error("Auction not found");
      error.statusCode = 404;
      return next(error);
    }

    // Increment views (fire and forget)
    auction.incrementViews().catch((err) => {
      console.error(
        `Non-blocking: Failed to increment views for auction ${auctionId}:`,
        err
      );
    });

    res.status(200).json({
      success: true,
      data: auction,
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

/**
 * @description Update an auction
 * @route PUT /api/v1/auctions/:id
 * @access Private (Auction Seller or Admin only)
 */
const updateAuction = async (req, res, next) => {
  try {
    const auctionId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      const error = new Error("Invalid auction ID format");
      error.statusCode = 400;
      return next(error);
    }

    let auction = await Auction.findById(auctionId);

    if (!auction) {
      const error = new Error("Auction not found");
      error.statusCode = 404;
      return next(error);
    }

    // Authorization
    if (auction.seller.toString() !== userId && !isAdmin) {
      const error = new Error("Not authorized to update this auction");
      error.statusCode = 403; // Forbidden
      return next(error);
    }

    // Business Logic Checks
    const currentStatus = auction.status; // Use virtual
    if (currentStatus === "ended" && !isAdmin) {
      const error = new Error("Cannot update an ended auction");
      error.statusCode = 400;
      return next(error);
    }
    if (
      req.body.startingBid !== undefined &&
      auction.startingBid !== req.body.startingBid
    ) {
      if (
        (currentStatus === "active" ||
          currentStatus === "ended" ||
          auction.bidCount > 0) &&
        !isAdmin
      ) {
        const error = new Error(
          "Cannot change starting bid after auction starts or receives bids"
        );
        error.statusCode = 400;
        return next(error);
      }
      if (auction.bidCount === 0) req.body.currentBid = req.body.startingBid;
    }

    // Whitelist updates
    const allowedUpdates = [
      "title",
      "description",
      "imageUrl",
      "images",
      "category",
      "location",
      "documents",
    ];
    if (
      isAdmin ||
      (currentStatus === "upcoming" && auction.seller.toString() === userId)
    ) {
      allowedUpdates.push("endTime", "startTime");
      if (req.body.endTime) req.body.endTime = new Date(req.body.endTime);
      if (req.body.startTime) req.body.startTime = new Date(req.body.startTime);
      const newEndTime = req.body.endTime || auction.endTime;
      const newStartTime = req.body.startTime || auction.startTime;
      if (newEndTime <= newStartTime) {
        const error = new Error("End time must be after start time");
        error.statusCode = 400;
        return next(error);
      }
    }
    if (
      isAdmin ||
      (currentStatus === "upcoming" &&
        auction.seller.toString() === userId &&
        auction.bidCount === 0)
    ) {
      allowedUpdates.push("startingBid");
    }

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        auction[key] = req.body[key];
      }
    });

    await auction.save(); // Triggers validation
    await auction.populate("seller", "fullName profilePictureUrl email");
    await auction.populate("highestBidder", "fullName");

    res.status(200).json({
      success: true,
      message: "Auction updated successfully",
      data: auction,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      const validationError = new Error(
        `Validation Error: ${messages.join(", ")}`
      );
      validationError.statusCode = 400;
      return next(validationError);
    }
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

/**
 * @description Delete an auction
 * @route DELETE /api/v1/auctions/:id
 * @access Private (Auction Seller or Admin only)
 */
const deleteAuction = async (req, res, next) => {
  try {
    const auctionId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      const error = new Error("Invalid auction ID format");
      error.statusCode = 400;
      return next(error);
    }

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      const error = new Error("Auction not found");
      error.statusCode = 404;
      return next(error);
    }

    // Authorization
    if (auction.seller.toString() !== userId && !isAdmin) {
      const error = new Error("Not authorized to delete this auction");
      error.statusCode = 403;
      return next(error);
    }

    // Business Logic
    const currentStatus = auction.status;
    if (
      ["active", "ended"].includes(currentStatus) &&
      auction.bidCount > 0 &&
      !isAdmin
    ) {
      const error = new Error(
        "Cannot delete an auction that is active or ended with bids"
      );
      error.statusCode = 400;
      return next(error);
    }

    // Consider deleting related Bids
    // await Bid.deleteMany({ auction: auctionId });

    await Auction.findByIdAndDelete(auctionId);

    res.status(200).json({
      success: true,
      message: "Auction deleted successfully",
      data: null,
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

/**
 * @description Like or unlike an auction
 * @route PATCH /api/v1/auctions/:id/like
 * @access Private (Requires login)
 */
const toggleLikeAuction = async (req, res, next) => {
  try {
    const auctionId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      const error = new Error("Invalid auction ID format");
      error.statusCode = 400;
      return next(error);
    }

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      const error = new Error("Auction not found");
      error.statusCode = 404;
      return next(error);
    }

    const isLiked = auction.likedBy.some((likerId) => likerId.equals(userId));
    let updateOperation;
    let message;

    if (isLiked) {
      updateOperation = { $pull: { likedBy: userId } };
      message = "Auction unliked successfully";
    } else {
      updateOperation = { $addToSet: { likedBy: userId } };
      message = "Auction liked successfully";
    }

    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      updateOperation,
      { new: true }
    ).populate("seller", "fullName profilePictureUrl");

    res.status(200).json({
      success: true,
      message: message,
      data: updatedAuction,
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

/**
 * @description Get auctions created by the logged-in user
 * @route GET /api/v1/auctions/my-auctions
 * @access Private (Requires login)
 */
const getMyAuctions = async (req, res, next) => {
  try {
    const { page, limit, skip, sortOptions } = parseQueryOptions(req.query);
    const sellerId = req.user.id;
    const filter = { seller: sellerId };
    const now = new Date();

    // Filtering for user's own auctions
    if (req.query.status) {
      switch (req.query.status) {
        case "upcoming":
          filter.startTime = { $gt: now };
          break;
        case "active":
          filter.startTime = { $lte: now };
          filter.endTime = { $gt: now };
          break;
        case "ended":
          filter.endTime = { $lte: now };
          break;
      }
    }
    if (req.query.category) filter.category = req.query.category;

    const auctions = await Auction.find(filter)
      .populate("seller", "fullName profilePictureUrl")
      .populate("highestBidder", "fullName")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalAuctions = await Auction.countDocuments(filter);
    const totalPages = Math.ceil(totalAuctions / limit);

    res.status(200).json({
      success: true,
      count: auctions.length,
      pagination: { totalAuctions, totalPages, currentPage: page, limit },
      data: auctions,
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

/**
 * @description Get auctions liked by the logged-in user
 * @route GET /api/v1/auctions/liked-auctions
 * @access Private (Requires login)
 */
const getLikedAuctions = async (req, res, next) => {
  try {
    const { page, limit, skip, sortOptions } = parseQueryOptions(req.query);
    const userId = req.user.id;
    const filter = { likedBy: userId };
    const now = new Date();

    // Filtering for liked auctions
    if (req.query.status) {
      switch (req.query.status) {
        case "upcoming":
          filter.startTime = { $gt: now };
          break;
        case "active":
          filter.startTime = { $lte: now };
          filter.endTime = { $gt: now };
          break;
        case "ended":
          filter.endTime = { $lte: now };
          break;
      }
    }
    if (req.query.category) filter.category = req.query.category;

    const auctions = await Auction.find(filter)
      .populate("seller", "fullName profilePictureUrl")
      .populate("highestBidder", "fullName")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalAuctions = await Auction.countDocuments(filter);
    const totalPages = Math.ceil(totalAuctions / limit);

    res.status(200).json({
      success: true,
      count: auctions.length,
      pagination: { totalAuctions, totalPages, currentPage: page, limit },
      data: auctions,
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

module.exports = {
  createAuction,
  listAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
  toggleLikeAuction,
  getMyAuctions,
  getLikedAuctions,
};
