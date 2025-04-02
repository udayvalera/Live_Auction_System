// models/Auction.js
const mongoose = require('mongoose');

// --- Sub-Schema for Documents ---
const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true }
}, { _id: false });

// --- Main Auction Schema ---
const AuctionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true, trim: true },
  imageUrl: { type: String, trim: true, default: null },
  images: {
    type: [String],
    validate: [
        function(val) { return val.length > 0 || !!this.imageUrl; },
        'At least one image URL in images array or a primary imageUrl is required'
    ],
    default: [],
  },
  startingBid: { type: Number, required: true, min: 0 },
  currentBid: {
    type: Number,
    default: function() { return this.startingBid; },
    min: 0,
    required: true,
  },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  bidCount: { type: Number, default: 0, min: 0 },
  views: { type: Number, default: 0, min: 0 }, // The field we want to increment
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  startTime: { type: Date, default: Date.now, index: true },
  endTime: {
    type: Date,
    required: true,
    validate: [
        function(value) { return !this.startTime || value > this.startTime; },
        'End time must be after start time'
    ],
    index: true,
  },
  documents: { type: [DocumentSchema], default: [] },
  category: { type: String, trim: true, index: true },
  location: { type: String, trim: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Virtuals ---
AuctionSchema.virtual('likes').get(function() {
  return this.likedBy ? this.likedBy.length : 0;
});

AuctionSchema.virtual('status').get(function() {
  const now = new Date();
  const startTime = this.startTime instanceof Date ? this.startTime : new Date(this.startTime);
  const endTime = this.endTime instanceof Date ? this.endTime : new Date(this.endTime);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) return 'invalid-dates';
  if (now < startTime) return 'upcoming';
  if (now >= startTime && now < endTime) {
    const oneHour = 60 * 60 * 1000;
    return (endTime.getTime() - now.getTime() < oneHour) ? 'ending-soon' : 'active';
  }
  return 'ended'; // now >= endTime
});

// --- Indexes ---
AuctionSchema.index({ status: 1, endTime: 1 });
AuctionSchema.index({ category: 1, status: 1 });
AuctionSchema.index({ seller: 1, status: 1 });


// --- Instance Methods ---

/**
 * Atomically increments the view count for this auction document in the database.
 * Also updates the 'views' property on the current model instance in memory.
 * Should be called when an auction's detail page is viewed.
 * @returns {Promise<Auction>} The auction instance (this) with the updated view count in memory.
 * @throws {Error} If the database update fails.
 */
AuctionSchema.methods.incrementViews = async function() {
  try {
    // Use the $inc operator for an atomic update directly in the database
    // this.constructor refers to the Model (Auction) from the instance
    await this.constructor.updateOne(
      { _id: this._id },      // Find this specific document
      { $inc: { views: 1 } }  // Increment the 'views' field by 1
    );

    // Manually increment the 'views' count on the current instance in memory
    // so it reflects the change without needing to re-fetch the document.
    this.views += 1;

    return this; // Return the instance for chaining or further use

  } catch (error) {
    // Log the error or handle it as needed
    console.error(`Error incrementing views for auction ${this._id}:`, error);
    // Re-throw the error so the calling function knows something went wrong
    throw error;
  }
};


// --- Model Creation ---
const Auction = mongoose.model('Auction', AuctionSchema);

// --- Export ---
module.exports = Auction;