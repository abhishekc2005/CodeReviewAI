import crypto from "crypto";

/**
 * Generate a cryptographically secure random reset token
 * Returns { rawToken, hashedToken }
 * - rawToken: sent to user via email (never stored in DB)
 * - hashedToken: stored in DB for verification
 */
function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return { rawToken, hashedToken };
}

/**
 * Hash a raw token for comparison with stored hash
 */
function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export { generateResetToken,
  hashToken,
};
