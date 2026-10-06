import { useState } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import Editor from "react-simple-code-editor";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import Footer from "./components/Footer";

function App() {

  const [code, setCode] = useState("// ✨ Write or paste your code here to review");
  const [review, setReview] = useState("Your AI code review will appear here...");
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const reviewCode = async () => {

    if (loading) return;

    if (!code || code.trim().length < 5) {
      setReview("⚠️ Please write or paste some code first.");
      return;
    }

    setLoading(true);
    setReview("⏳ Reviewing your code with AI...");

    try {
      
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${API_URL}/ai/get-review`,
        { code },
        { withCredentials: true }
      );

      const aiReview = response?.data?.review;

      if (aiReview) {
        setReview(aiReview);
      } else {
        setReview("⚠️ AI returned no review.");
      }

    } catch (error) {

      console.error("Review API Error:", error);

      if (error.response?.status === 401) {
        setReview("⚠️ Your session has expired. Please login again.");
        // Refresh auth state and redirect to login
        setTimeout(() => {
          logout();
          navigate("/", { replace: true });
        }, 2000);
      }

      else if (error.response?.status === 429) {
        const msg = error.response?.data?.error || "Too many requests. Please wait.";
        setReview(`⚠️ ${msg}`);
      }

      else if (error.response?.status === 500) {
        setReview("⚠️ Server error. AI service temporarily unavailable.");
      }

      else {
        setReview("⚠️ Network error. Check your connection.");
      }

    } finally {

      // cooldown before enabling button again
      setTimeout(() => {
        setLoading(false);
      }, 5000);

    }
  };

  return (
    <div className="app">

      <header className="app-header">
        <div className="app-header-brand">
          <span className="app-header-logo">⚡</span>
          <span className="app-header-title">CodeReviewAI</span>
        </div>
        <div className="app-header-user">
          {user && (
            <>
              <span className="app-header-username">
                {user.name}
              </span>
              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <span className="app-header-badge">AI Powered</span>
          )}
        </div>
      </header>

      <main>

        <div className="left">

          <div className="panel-label">
            <span className="panel-label-dot"></span>
            Code Editor
          </div>

          <div className="code">

            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                Prism.highlight(
                  code,
                  Prism.languages.javascript,
                  "javascript"
                )
              }
              padding={16}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 15,
                minHeight: "220px",
                lineHeight: 1.7,
              }}
            />

          </div>

          <button
            className="review"
            onClick={reviewCode}
            disabled={loading}
          >
            {loading ? "🔄 Reviewing..." : "🚀 Review Code"}
          </button>

        </div>

        <div className="right">

          <div className="right-header">
            <span className="right-header-icon">✨</span>
            <h3>AI Review</h3>
          </div>

          <div className="review-content">
            <ReactMarkdown>
              {review}
            </ReactMarkdown>
          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default App;
