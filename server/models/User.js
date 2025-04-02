// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't return password by default
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    profilePictureUrl: {
      type: String,
      trim: true,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt

// --- Mongoose Middleware ---

// Hash password BEFORE saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// --- Mongoose Instance Methods ---

// Method to compare entered password with the hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // Fetch user with .select('+password') before calling this
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Updates the lastLogin field for the user instance to the current time
 * and saves the document.
 * Should be called after successful authentication.
 * @returns {Promise<User>} The saved user document.
 * @throws {Error} If saving fails.
 */
UserSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  // Using save() ensures validation and middleware (if any relevant ones existed) are run
  // Could also use User.updateOne({ _id: this._id }, { lastLogin: new Date() })
  // but this way keeps it contained within the instance method.
  return await this.save();
};

// Create and export the User model
const User = mongoose.model("User", UserSchema);

module.exports = User;
