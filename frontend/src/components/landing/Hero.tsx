import { Link } from "react-router-dom";
import { User } from "../../context/AuthContext";

function Hero({ user }: { user: User | null }) {
  return (
    <section className="landing-hero">
      <div className="landing-hero-bg" aria-hidden="true"></div>
      <div className="landing-hero-grid" aria-hidden="true"></div>

      <div className="landing-hero-inner">

        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <span className="landing-hero-badge-dot"></span>
            AI-Powered Code Analysis
          </div>

          <h1 className="landing-hero-title">
            Review Code. <span className="landing-hero-title-accent">Fix Issues.</span> Understand Your Repository.
          </h1>

          <p className="landing-hero-desc">
            AI-powered code reviews and GitHub repository analysis that help developers find issues, understand their code, and generate improved solutions.
          </p>

          <div className="landing-hero-actions">
            {user ? (
              <Link to="/app" className="landing-hero-btn-primary">
                Open CodeReviewAI →
              </Link>
            ) : (
              <>
                <Link to="/signup" className="landing-hero-btn-primary">
                  Start Reviewing →
                </Link>
                <a href="#github-preview" className="landing-hero-btn-secondary">
                  Explore GitHub Review
                </a>
              </>
            )}
          </div>
        </div>

        <div className="landing-hero-visual">
          <div className="landing-hero-card">
            <div className="landing-hero-card-header">
              <span className="landing-hero-card-dot"></span>
              <span className="landing-hero-card-dot"></span>
              <span className="landing-hero-card-dot"></span>
              <span className="landing-hero-card-title">code-review.js</span>
            </div>
            <div className="landing-hero-card-body">
              <div className="landing-hero-code">
                <pre>
                  <span className="code-keyword">function</span>{" "}
                  <span className="code-function">calculateTotal</span>
                  <span className="code-operator">(</span>
                  <span className="code-param">items</span>
                  <span className="code-operator">)</span>{" "}
                  <span className="code-operator">{"{"}</span>
                  {"\n"}
                  {"  "}
                  <span className="code-keyword">return</span>{" "}
                  <span className="code-param">items</span>
                  <span className="code-operator">.</span>
                  <span className="code-function">reduce</span>
                  <span className="code-operator">(</span>
                  <span className="code-operator">(</span>
                  <span className="code-param">sum</span>
                  <span className="code-operator">,</span>{" "}
                  <span className="code-param">item</span>
                  <span className="code-operator">)</span>{" "}
                  <span className="code-operator">{"=>"}</span>{" "}
                  <span className="code-operator">{"{"}</span>
                  {"\n"}
                  {"    "}
                  <span className="code-keyword">return</span>{" "}
                  <span className="code-param">sum</span>{" "}
                  <span className="code-operator">+</span>{" "}
                  <span className="code-param">item</span>
                  <span className="code-operator">.</span>
                  <span className="code-param">price</span>
                  <span className="code-operator">;</span>
                  {"\n"}
                  {"  "}
                  <span className="code-operator">{"}"}</span>
                  <span className="code-operator">,</span>{" "}
                  <span className="code-number">0</span>
                  <span className="code-operator">)</span>
                  <span className="code-operator">;</span>
                  {"\n"}
                  <span className="code-operator">{"}"}</span>
                </pre>
              </div>

              <div className="landing-hero-checks">
                <div className="landing-hero-check">
                  <span className="landing-hero-check-icon">✓</span>
                  Code Quality
                </div>
                <div className="landing-hero-check">
                  <span className="landing-hero-check-icon">✓</span>
                  Performance
                </div>
                <div className="landing-hero-check">
                  <span className="landing-hero-check-icon">✓</span>
                  Security
                </div>
                <div className="landing-hero-check">
                  <span className="landing-hero-check-icon">✓</span>
                  Maintainability
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
