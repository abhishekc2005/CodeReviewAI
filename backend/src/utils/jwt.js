const jwt = require("jsonwebtoken");

const JWT_EXPIRY = "7d";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

/**
 * Generate a JWT token containing the userId
 */
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
}

/**
 * Verify a JWT token and return the decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Get cookie options based on current environment
 */
function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
}

/**
 * Set JWT token as HTTP-only cookie on the response
 */
function setTokenCookie(res, userId) {
  const token = generateToken(userId);
  res.cookie("token", token, getCookieOptions());
  return token;
}

/**
 * Clear the JWT token cookie
 */
function clearTokenCookie(res) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 0,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
}

module.exports = {
  generateToken,
  verifyToken,
  getCookieOptions,
  setTokenCookie,
  clearTokenCookie,
};
