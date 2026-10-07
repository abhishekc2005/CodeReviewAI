import { useAuth } from "../context/AuthContext";
import LandingNavbar from "../components/landing/LandingNavbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import ReviewPreview from "../components/landing/ReviewPreview";
import GithubPreview from "../components/landing/GithubPreview";
import TrustSection from "../components/landing/TrustSection";
import FinalCTA from "../components/landing/FinalCTA";
import LandingFooter from "../components/landing/LandingFooter";
import "./Landing.css";

function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="landing">
      <LandingNavbar user={user} />
      <Hero user={user} />
      <Features />
      <HowItWorks />
      <ReviewPreview />
      <GithubPreview />
      <TrustSection />
      <FinalCTA user={user} />
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
