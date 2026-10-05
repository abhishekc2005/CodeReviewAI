const { verifyToken } = require("../utils/jwt");

/**
 * Authentication middleware
 * Reads JWT from HTTP-only cookie, verifies it, and attaches userId to req
 */
const protect = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Please login.",
      });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

module.exports = { protect };
