import { Link } from "react-router-dom";

function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div className="landing-footer-brand">
          <div className="landing-footer-brand-name">
            <span>⚡</span>
            <span>CodeReviewAI</span>
          </div>
          <p className="landing-footer-brand-desc">
            AI-powered code review for modern developers.
          </p>
        </div>

        <nav className="landing-footer-links">
          <a
            href="#features"
            className="landing-footer-link"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="landing-footer-link"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            How It Works
          </a>
          <Link to="/login" className="landing-footer-link">
            Login
          </Link>
          <Link to="/signup" className="landing-footer-link">
            Sign Up
          </Link>
        </nav>
      </div>

      <div className="landing-footer-bottom">
        <p>CodeReviewAI</p>
        <p>Developed by ABHISHEK · © 2026 All rights reserved</p>
      </div>
    </footer>
  );
}

export default LandingFooter;
