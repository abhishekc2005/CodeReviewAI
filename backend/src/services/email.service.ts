import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/**
 * Send a password reset email using Resend
 */
async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from: "CodeReviewAI <onboarding@resend.dev>",
    to: [email],
    subject: "Reset Your Password — CodeReviewAI",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0f1e; font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 480px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1a1f35 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <span style="font-size: 28px;">⚡</span>
                    <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.02em;">
                      CodeReview<span style="color: #818cf8;">AI</span>
                    </h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding: 32px;">
                    <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #f1f5f9;">
                      Password Reset
                    </h2>
                    <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                      We received a request to reset your password. Click the button below to create a new password.
                    </p>
                    <!-- Button -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="text-align: center; padding: 8px 0 24px;">
                          <a href="${resetUrl}"
                             style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 600; color: #ffffff; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px; text-decoration: none; letter-spacing: 0.02em;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <!-- Expiry Warning -->
                    <div style="padding: 12px 16px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.15); border-radius: 8px; margin-bottom: 20px;">
                      <p style="margin: 0; font-size: 13px; color: #f59e0b; line-height: 1.5;">
                        ⏰ This link expires in <strong>15 minutes</strong>. After that, you'll need to request a new one.
                      </p>
                    </div>
                    <!-- Security Notice -->
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #64748b;">
                      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
                    <p style="margin: 0; font-size: 12px; color: #475569;">
                      © ${new Date().getFullYear()} CodeReviewAI — All rights reserved
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error("Resend email error:", error.message);
    throw new Error("Failed to send password reset email");
  }

  return data;
}

export { sendPasswordResetEmail };
