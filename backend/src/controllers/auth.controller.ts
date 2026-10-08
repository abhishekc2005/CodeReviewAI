import { Request, Response } from 'express';
import User from "../models/User";
import PasswordResetAttempt from "../models/PasswordResetAttempt";
import { setTokenCookie, clearTokenCookie } from "../utils/jwt";
import { generateResetToken, hashToken } from "../utils/resetToken";
import { sendPasswordResetEmail } from "../services/email.service";

// ─── Helpers ─────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\d{7,15}$/;

function isEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

function isMobile(value: string): boolean {
  return MOBILE_REGEX.test(value);
}

// ─── SIGNUP ──────────────────────────────────────────────

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: "Name is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        error: "Password is required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }

    const trimmedEmail = email ? email.trim().toLowerCase() : "";
    const trimmedMobile = mobile ? mobile.trim() : "";

    if (!trimmedEmail && !trimmedMobile) {
      return res.status(400).json({
        success: false,
        error: "At least one of email or mobile is required",
      });
    }

    // Validate formats
    if (trimmedEmail && !isEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    if (trimmedMobile && !isMobile(trimmedMobile)) {
      return res.status(400).json({
        success: false,
        error: "Invalid mobile number format",
      });
    }

    // Check for duplicates
    if (trimmedEmail) {
      const existingEmail = await User.findOne({ email: trimmedEmail });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: "Email is already registered",
        });
      }
    }

    if (trimmedMobile) {
      const existingMobile = await User.findOne({ mobile: trimmedMobile });
      if (existingMobile) {
        return res.status(409).json({
          success: false,
          error: "Mobile number is already registered",
        });
      }
    }

    // Create user — only set email/mobile if provided (avoid empty strings in unique index)
    const userData: Record<string, string> = {
      name: name.trim(),
      password,
    };

    if (trimmedEmail) userData.email = trimmedEmail;
    if (trimmedMobile) userData.mobile = trimmedMobile;

    const user = await User.create(userData);

    // Set JWT cookie (user is logged in after signup)
    setTokenCookie(res, String(user._id));

    return res.status(201).json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: number };
    console.error("Signup error:", err.message);

    // Handle mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Account with this email or mobile already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: err.message || "Signup failed. Please try again.",
    });
  }
};

// ─── LOGIN ───────────────────────────────────────────────

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: "Identifier and password are required",
      });
    }

    const trimmedIdentifier = identifier.trim().toLowerCase();

    // Determine if identifier is email or mobile
    let query: Record<string, string>;
    if (isEmail(trimmedIdentifier)) {
      query = { email: trimmedIdentifier };
    } else if (isMobile(trimmedIdentifier)) {
      query = { mobile: trimmedIdentifier };
    } else {
      // Could be an email without strict format — try email first
      query = { email: trimmedIdentifier };
    }

    // Find user with password field included
    const user = await User.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Set JWT cookie
    setTokenCookie(res, String(user._id));

    return res.status(200).json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Login error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Login failed. Please try again.",
    });
  }
};

// ─── LOGOUT ──────────────────────────────────────────────

export const logout = async (_req: Request, res: Response) => {
  try {
    clearTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Logout error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Logout failed",
    });
  }
};

// ─── GET CURRENT USER ────────────────────────────────────

export const me = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Get user error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Failed to get user info",
    });
  }
};

// ─── FORGOT PASSWORD ─────────────────────────────────────

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Generic response to prevent account enumeration
    const genericResponse = {
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };

    // Rate limit check
    const PASSWORD_RESET_LIMIT =
      Number(process.env.PASSWORD_RESET_LIMIT) || 3;
    const PASSWORD_RESET_WINDOW_MINUTES =
      Number(process.env.PASSWORD_RESET_WINDOW_MINUTES) || 15;

    const windowStart = new Date(
      Date.now() - PASSWORD_RESET_WINDOW_MINUTES * 60 * 1000
    );

    const attempt = await PasswordResetAttempt.findOne({
      email: trimmedEmail,
      windowStart: { $gte: windowStart },
    });

    if (attempt && attempt.attempts >= PASSWORD_RESET_LIMIT) {
      // Rate limited — return generic response to not reveal account existence
      return res.status(200).json(genericResponse);
    }

    // Find user
    const user = await User.findOne({ email: trimmedEmail }).select(
      "+resetPasswordTokenHash +resetPasswordExpires"
    );

    if (!user) {
      // User not found — return generic response
      return res.status(200).json(genericResponse);
    }

    // Generate reset token
    const { rawToken, hashedToken } = generateResetToken();

    // Save hashed token and expiry to user
    user.resetPasswordTokenHash = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save({ validateBeforeSave: false });

    // Track the attempt
    if (attempt) {
      attempt.attempts += 1;
      await attempt.save();
    } else {
      // Clean up old attempts for this email
      await PasswordResetAttempt.deleteMany({ email: trimmedEmail });
      await PasswordResetAttempt.create({
        email: trimmedEmail,
        attempts: 1,
        windowStart: new Date(),
      });
    }

    // Build reset URL
    const FRONTEND_URL =
      process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${rawToken}`;

    // Send email
    await sendPasswordResetEmail(trimmedEmail, resetUrl);

    return res.status(200).json(genericResponse);
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Forgot password error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong. Please try again.",
    });
  }
};

// ─── RESET PASSWORD ──────────────────────────────────────

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: "Token and new password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }

    // Hash the raw token to compare with stored hash
    const hashedToken = hashToken(token);

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordTokenHash: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password +resetPasswordTokenHash +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token",
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = password;

    // Clear reset token fields (single-use)
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login.",
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Reset password error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Password reset failed. Please try again.",
    });
  }
};
