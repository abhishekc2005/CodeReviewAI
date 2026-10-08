import { Response } from 'express';
import jwt from "jsonwebtoken";

const JWT_EXPIRY = "7d";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

/**
 * Generate a JWT token containing the userId
 */
function generateToken(userId: string) {
  return jwt.sign({ userId }, ((process.env.JWT_SECRET as string) as string), {
    expiresIn: JWT_EXPIRY,
  });
}

/**
 * Verify a JWT token and return the decoded payload
 */
function verifyToken(token: string) {
  return jwt.verify(token, ((process.env.JWT_SECRET as string) as string));
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
    sameSite: isProduction ? "none" as const : "lax" as const,
  };
}

/**
 * Set JWT token as HTTP-only cookie on the response
 */
function setTokenCookie(res: Response, userId: string) {
  const token = generateToken(userId);
  res.cookie("token", token, getCookieOptions());
  return token;
}

/**
 * Clear the JWT token cookie
 */
function clearTokenCookie(res: Response) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 0,
    secure: isProduction,
    sameSite: isProduction ? "none" as const : "lax" as const,
  });
}

export { generateToken,
  verifyToken,
  getCookieOptions,
  setTokenCookie,
  clearTokenCookie,
};
