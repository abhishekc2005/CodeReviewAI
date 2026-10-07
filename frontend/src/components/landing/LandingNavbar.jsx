import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function LandingNavbar({ user }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className={`landing-nav${scrolled ? " scrolled" : ""}`}>
        <div className="landing-nav-inner">

          <a href="#" className="landing-nav-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <span className="landing-nav-brand-icon">⚡</span>
            <span className="landing-nav-brand-text">CodeReviewAI</span>
          </a>

          <ul className="landing-nav-links">
            <li>
              <a href="#features" className="landing-nav-link" onClick={(e) => handleNavClick(e, "features")}>
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="landing-nav-link" onClick={(e) => handleNavClick(e, "how-it-works")}>
                How It Works
              </a>
            </li>
            <li>
              <a href="#github-preview" className="landing-nav-link" onClick={(e) => handleNavClick(e, "github-preview")}>
                GitHub Review
              </a>
            </li>
          </ul>

          <div className="landing-nav-actions">
            {user ? (
              <>
                <Link to="/app" className="landing-btn-primary">
                  Open CodeReviewAI →
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="landing-btn-ghost">
                  Login
                </Link>
                <Link to="/signup" className="landing-btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className={`landing-nav-toggle${mobileOpen ? " open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>
      </nav>

      <div className={`landing-mobile-menu${mobileOpen ? " open" : ""}`}>
        <ul className="landing-mobile-menu-links">
          <li>
            <a href="#features" className="landing-mobile-menu-link" onClick={(e) => handleNavClick(e, "features")}>
              Features
            </a>
          </li>
          <li>
            <a href="#how-it-works" className="landing-mobile-menu-link" onClick={(e) => handleNavClick(e, "how-it-works")}>
              How It Works
            </a>
          </li>
          <li>
            <a href="#github-preview" className="landing-mobile-menu-link" onClick={(e) => handleNavClick(e, "github-preview")}>
              GitHub Review
            </a>
          </li>
        </ul>
        <div className="landing-mobile-menu-actions">
          {user ? (
            <Link to="/app" className="landing-btn-primary" onClick={() => setMobileOpen(false)}>
              Open CodeReviewAI →
            </Link>
          ) : (
            <>
              <Link to="/login" className="landing-btn-ghost" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="landing-btn-primary" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default LandingNavbar;
