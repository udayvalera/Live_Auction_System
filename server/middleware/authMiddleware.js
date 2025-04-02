// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust path if needed

/**
 * Protects routes by verifying JWT token.
 * If token is valid, attaches a plain user object to req.user,
 * including an 'id' property derived from the user's '_id'.
 * Otherwise, sends a 401 Unauthorized error.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify the token
      const decoded = jwt.verify(token, "top-secret");
      // console.log("Decoded JWT:", decoded); // Debugging line
      // 4. Find the user associated with the token's ID
      //    - Exclude the password field
      const foundUser = await User.findById(decoded.userId).select("-password");

      if (!foundUser) {
        const error = new Error(
          "User belonging to this token no longer exists."
        );
        error.statusCode = 401;
        return next(error);
      }

      // Optional: Check if user is banned
      if (foundUser.isBanned) {
        const error = new Error("User account is banned.");
        error.statusCode = 403; // Forbidden
        return next(error);
      }

      // 5. Create a plain user object for the request
      //    and explicitly set the 'id' property.
      const userPayload = foundUser.toObject(); // Convert Mongoose doc to plain object

      // *** Set req.user.id explicitly ***
      userPayload.id = userPayload._id; // Assign the ObjectId value
      // or userPayload.id = userPayload._id.toString(); // Assign the string representation

      // Remove _id if you only want id (optional)
      // delete userPayload._id;

      // Attach the modified plain object to the request
      req.user = userPayload;

      // 6. Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Handle JWT errors
      let errorMessage = "Not authorized, token failed.";
      let statusCode = 401;

      if (error.name === "JsonWebTokenError") {
        errorMessage = "Invalid token.";
      } else if (error.name === "TokenExpiredError") {
        errorMessage = "Token has expired.";
      }

      if (process.env.NODE_ENV === "development") {
        console.error("Auth Middleware Error:", error);
      }

      const authError = new Error(errorMessage);
      authError.statusCode = statusCode;
      return next(authError);
    }
  }

  // 7. If no token is found
  if (!token) {
    const error = new Error("Not authorized, no token provided.");
    error.statusCode = 401;
    return next(error);
  }
};

/**
 * Optional: Middleware to restrict access to Admins only.
 */
const adminOnly = (req, res, next) => {
  // Now checks req.user.isAdmin (assuming isAdmin property exists on the plain object)
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    const error = new Error("Not authorized as an admin.");
    error.statusCode = 403;
    next(error);
  }
};

module.exports = {
  protect,
  adminOnly,
};
