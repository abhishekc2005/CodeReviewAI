import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL;

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-logo">⚠️</span>
            <h1 className="auth-title">Invalid Link</h1>
            <p className="auth-subtitle">
              This password reset link is invalid or missing a token.
            </p>
          </div>
          <div className="auth-links" style={{ textAlign: "center", padding: "20px" }}>
            <Link to="/forgot-password" className="auth-link">
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password) {
      setError("Please enter a new password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/reset-password`,
        { token, password },
        { withCredentials: true }
      );
      setMessage(
        response.data?.message ||
          "Password reset successfully. You can now login."
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Password reset failed. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🔑</span>
          <h1 className="auth-title">
            Reset <span className="auth-title-accent">Password</span>
          </h1>
          <p className="auth-subtitle">Enter your new password below</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          {message && (
            <div className="auth-success">
              {message}
              <br />
              <Link
                to="/login"
                className="auth-link"
                style={{ marginTop: "12px", display: "inline-block" }}
              >
                Go to Login →
              </Link>
            </div>
          )}

          {!message && (
            <>
              <div className="auth-field">
                <label htmlFor="reset-password">New Password</label>
                <input
                  id="reset-password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  autoFocus
                />
              </div>

              <div className="auth-field">
                <label htmlFor="reset-confirm">Confirm New Password</label>
                <input
                  id="reset-confirm"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          <div className="auth-links">
            <Link to="/login" className="auth-link">
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
