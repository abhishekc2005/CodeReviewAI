import { Link } from "react-router-dom";

function FinalCTA({ user }) {
  return (
    <section className="landing-section landing-cta">
      <div className="landing-cta-bg" aria-hidden="true"></div>
      <div className="landing-cta-inner">
        <h2 className="landing-cta-title">Ready to write better code?</h2>
        <p className="landing-cta-desc">
          Start reviewing your code with AI and get actionable feedback in
          seconds.
        </p>

        {user ? (
          <Link to="/app" className="landing-cta-btn">
            Open CodeReviewAI →
          </Link>
        ) : (
          <>
            <Link to="/signup" className="landing-cta-btn">
              Start Reviewing for Free →
            </Link>
            <p className="landing-cta-login">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export default FinalCTA;
