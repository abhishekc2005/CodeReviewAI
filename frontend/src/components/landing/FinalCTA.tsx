import { Link } from "react-router-dom";
import { User } from "../../context/AuthContext";

function FinalCTA({ user }: { user: User | null }) {
  return (
    <section className="landing-section landing-cta">
      <div className="landing-cta-bg" aria-hidden="true"></div>
      <div className="landing-cta-inner">
        <h2 className="landing-cta-title">Ready to Write Better Code?</h2>
        <p className="landing-cta-desc">
          Review your code, analyze your repository, fix issues, and ship with confidence.
        </p>

        {user ? (
          <Link to="/app" className="landing-cta-btn">
            Open CodeReviewAI →
          </Link>
        ) : (
          <>
            <Link to="/signup" className="landing-cta-btn">
              Start Reviewing →
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
