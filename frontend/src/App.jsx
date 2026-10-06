import { useState } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import "prismjs/components/prism-markup"; // HTML uses markup, required by PHP
import "prismjs/components/prism-markup-templating"; // Required by PHP
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-php";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-css";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-bash";
import Editor from "react-simple-code-editor";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import Footer from "./components/Footer";

const LANGUAGES = [
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "c", name: "C" },
  { id: "cpp", name: "C++" },
  { id: "csharp", name: "C#" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "php", name: "PHP" },
  { id: "ruby", name: "Ruby" },
  { id: "kotlin", name: "Kotlin" },
  { id: "swift", name: "Swift" },
  { id: "sql", name: "SQL" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "dart", name: "Dart" },
  { id: "bash", name: "Shell / Bash" }
];

function App() {

  const [code, setCode] = useState("// ✨ Write or paste your code here to review");
  const [language, setLanguage] = useState("javascript");
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
        { code, language },
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

          <div className="panel-label" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingRight: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="panel-label-dot"></span>
              Code Editor
            </div>
            <div className="language-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="language-select" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'none', letterSpacing: 'normal' }}>Language:</label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  background: 'var(--color-bg-editor)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="code">

            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => {
                const prismLangId = language === "html" ? "markup" : language;
                const grammar = Prism.languages[prismLangId];
                if (grammar) {
                  try {
                    return Prism.highlight(code, grammar, prismLangId);
                  } catch (e) {
                    console.error("Prism highlight error:", e);
                  }
                }
                // Fallback to plain text if grammar is missing or throws error
                return code;
              }}
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

          <div className="right-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="right-header-icon">✨</span>
              <h3>AI Review</h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>
              Reviewed as {LANGUAGES.find(l => l.id === language)?.name}
            </span>
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
