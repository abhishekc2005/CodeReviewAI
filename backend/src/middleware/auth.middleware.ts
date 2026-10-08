import { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../utils/jwt";

/**
 * Authentication middleware
 * Reads JWT from HTTP-only cookie, verifies it, and attaches userId to req
 */
const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Please login.",
      });
    }

    const decoded = verifyToken(token) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

export { protect };
