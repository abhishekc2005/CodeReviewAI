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

const selectStyle = {
  background: 'var(--color-bg-editor)',
  color: 'var(--color-text-primary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: '4px 8px',
  fontSize: '0.75rem',
  outline: 'none',
  cursor: 'pointer'
};

const labelStyle = {
  fontSize: '0.75rem',
  color: 'var(--color-text-secondary)',
  textTransform: 'none',
  letterSpacing: 'normal'
};

function App() {

  const [code, setCode] = useState("// ✨ Write or paste your code here to review");
  const [language, setLanguage] = useState("javascript");
  const [reviewMode, setReviewMode] = useState("code"); // "code" | "repo"
<<<<<<< HEAD:frontend/src/App.tsx
  const [repoUrl, setRepoUrl] = useState("");
  const [review, setReview] = useState("Your AI code review will appear here...");
  const [loading, setLoading] = useState(false);
  const [reviewLabel, setReviewLabel] = useState(""); // label shown in right panel header
  const [fixedCode, setFixedCode] = useState<string | null>(null);
=======
  
  // Code Review State
  const [codeReview, setCodeReview] = useState("Your AI code review will appear here...");
  const [codeReviewLoading, setCodeReviewLoading] = useState(false);
  const [codeReviewLabel, setCodeReviewLabel] = useState("");
  const [fixedCode, setFixedCode] = useState(null);
>>>>>>> 993f44c (fix: responsive layout and review mode state isolation):frontend/src/App.jsx
  const [fixing, setFixing] = useState(false);

  // Repo Review State
  const [repoUrl, setRepoUrl] = useState("");
  const [repoReview, setRepoReview] = useState("Your AI repository review will appear here...");
  const [repoReviewLoading, setRepoReviewLoading] = useState(false);
  const [repoReviewLabel, setRepoReviewLabel] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  // ─── Code Review Handler (existing) ─────────────────
  const reviewCode = async () => {

    if (codeReviewLoading) return;

    if (!code || code.trim().length < 5) {
      setCodeReview("⚠️ Please write or paste some code first.");
      return;
    }

    setCodeReviewLoading(true);
    setCodeReview("⏳ Reviewing your code with AI...");
    setCodeReviewLabel(LANGUAGES.find(l => l.id === language)?.name || language);
    setFixedCode(null); // Clear previous fixed code when starting a new review

    try {
      
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${API_URL}/ai/get-review`,
        { code, language },
        { withCredentials: true }
      );

      const aiReview = response?.data?.review;

      if (aiReview) {
        setCodeReview(aiReview);
      } else {
        setCodeReview("⚠️ AI returned no review.");
      }

    } catch (error: any) {

      console.error("Review API Error:", error);

      if (error.response?.status === 401) {
        setCodeReview("⚠️ Your session has expired. Please login again.");
        setTimeout(() => {
          logout();
          navigate("/", { replace: true });
        }, 2000);
      }

      else if (error.response?.status === 429) {
        const msg = error.response?.data?.error || "Too many requests. Please wait.";
        setCodeReview(`⚠️ ${msg}`);
      }

      else if (error.response?.status === 500) {
        setCodeReview("⚠️ Server error. AI service temporarily unavailable.");
      }

      else {
        setCodeReview("⚠️ Network error. Check your connection.");
      }

    } finally {

      setTimeout(() => {
        setCodeReviewLoading(false);
      }, 5000);

    }
  };

  // ─── Fix Code Handler (new) ─────────────────────────
  const fixCode = async () => {
    if (fixing || codeReviewLoading) return;
    
    setFixing(true);
    const prevReview = codeReview; // Store current review to restore if needed
    setCodeReview("⏳ Generating fixed code...");
    setFixedCode(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${API_URL}/ai/fix-code`,
        { code, language, reviewContext: prevReview !== "Your AI code review will appear here..." ? prevReview : "" },
        { withCredentials: true }
      );

      const aiFixedCode = response?.data?.fixedCode;

      if (aiFixedCode) {
        setFixedCode(aiFixedCode);
        setCodeReview(prevReview); // Restore review
      } else {
        setCodeReview("⚠️ AI returned no fixed code.\n\n" + prevReview);
      }
    } catch (error: any) {
      console.error("Fix API Error:", error);
      const msg = error.response?.data?.error || "Error generating fix. Please try again.";
      setCodeReview(`⚠️ ${msg}\n\n` + prevReview);
    } finally {
      setFixing(false);
    }
  };

  // ─── Repository Review Handler (new) ────────────────
  const reviewRepo = async () => {
    if (repoReviewLoading) return;

    const trimmedUrl = repoUrl.trim();
    if (!trimmedUrl) {
      setRepoReview("⚠️ Please enter a GitHub repository URL.");
      return;
    }

    // Basic client-side validation
    if (!/^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/.test(trimmedUrl.replace(/\/+$/, ""))) {
      setRepoReview("⚠️ Please enter a valid public GitHub repository URL.\n\nExample: https://github.com/user/repository");
      return;
    }

    setRepoReviewLoading(true);
    setRepoReview("⏳ Analyzing repository...\n\nInspecting project structure, technologies, and code quality...");
    setRepoReviewLabel("GitHub Repository");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${API_URL}/api/repo/review`,
        { repoUrl: trimmedUrl },
        { withCredentials: true, timeout: 120000 }
      );

      const aiReview = response?.data?.review;

      if (aiReview) {
        setRepoReview(aiReview);
      } else {
        setRepoReview("⚠️ AI returned no review.");
      }

    } catch (error: any) {
      console.error("Repo Review API Error:", error);

      const status = error.response?.status;
      const msg = error.response?.data?.message || error.response?.data?.error;

      if (status === 401) {
        setRepoReview("⚠️ Your session has expired. Please login again.");
        setTimeout(() => {
          logout();
          navigate("/", { replace: true });
        }, 2000);
      }

      else if (status === 400) {
        setRepoReview(`⚠️ ${msg || "Invalid repository URL."}`);
      }

      else if (status === 404) {
        setRepoReview(`⚠️ ${msg || "Repository not found or it is private. Please provide a public GitHub repository."}`);
      }

      else if (status === 429) {
        setRepoReview(`⚠️ ${msg || "Rate limit reached. Please try again later."}`);
      }

      else if (status >= 500) {
        setRepoReview(`⚠️ ${msg || "Server error. AI service temporarily unavailable."}`);
      }

      else if (error.code === "ECONNABORTED") {
        setRepoReview("⚠️ Request timed out. The repository may be too large. Please try a smaller repository.");
      }

      else {
        setRepoReview("⚠️ Network error. Check your connection.");
      }

    } finally {
      setTimeout(() => {
        setRepoReviewLoading(false);
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

          {/* ── Toolbar: Review Mode + Language ── */}
          <div className="panel-label" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingRight: '4px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="panel-label-dot"></span>
              {reviewMode === "code" ? "Code Editor" : "GitHub Repository"}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Review Type Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <label htmlFor="review-mode-select" style={labelStyle}>Review:</label>
                <select
                  id="review-mode-select"
                  value={reviewMode}
                  onChange={(e) => setReviewMode(e.target.value)}
                  style={selectStyle}
                >
                  <option value="code">Code Review</option>
                  <option value="repo">GitHub Repository</option>
                </select>
              </div>

              {/* Language Selector — only in Code Review mode */}
              {reviewMode === "code" && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label htmlFor="language-select" style={labelStyle}>Language:</label>
                  <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={selectStyle}
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* ── Code Editor (Code Review mode) ── */}
          {reviewMode === "code" && (
            <>
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
                disabled={codeReviewLoading}
              >
                {codeReviewLoading ? "🔄 Reviewing..." : "🚀 Review Code"}
              </button>
            </>
          )}

          {/* ── GitHub URL Input (GitHub Repository mode) ── */}
          {reviewMode === "repo" && (
            <>
              <div className="repo-input-container">
                <div className="repo-input-icon">🔗</div>
                <input
                  id="repo-url-input"
                  type="url"
                  className="repo-url-input"
                  placeholder="Enter public GitHub repository URL..."
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") reviewRepo(); }}
                  disabled={repoReviewLoading}
                />
              </div>
              <p className="repo-helper-text">
                Public GitHub repositories only · Example: https://github.com/user/repository
              </p>

              <button
                className="review"
                onClick={reviewRepo}
                disabled={repoReviewLoading}
              >
                {repoReviewLoading ? "🔄 Analyzing Repository..." : "📦 Review Repository"}
              </button>
            </>
          )}

        </div>

        <div className="right">

          <div className="right-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="right-header-icon">✨</span>
              <h3>AI Review</h3>
            </div>
            {((reviewMode === "code" && codeReviewLabel) || (reviewMode === "repo" && repoReviewLabel)) && (
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>
                {reviewMode === "code" ? `Reviewed as ${codeReviewLabel}` : `📦 ${repoReviewLabel}`}
              </span>
            )}
          </div>

          <div className="review-content">
            <ReactMarkdown>
              {reviewMode === "code" ? codeReview : repoReview}
            </ReactMarkdown>

            {/* Render Fix button if we are in code mode and a valid review exists */}
            {reviewMode === "code" && 
             codeReview && 
             codeReview !== "Your AI code review will appear here..." && 
             !codeReview.startsWith("⏳") && 
             !codeReview.startsWith("⚠️") && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
                <button 
                  className="fix-btn" 
                  onClick={fixCode} 
                  disabled={fixing}
                >
                  {fixing ? "✨ Fixing Code..." : "🔧 Fix This Code"}
                </button>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* ── Before vs After Section ── */}
      {reviewMode === "code" && fixedCode && (
        <section className="diff-section">
          <div className="diff-header">
            <h3>✨ Fixed Code Comparison</h3>
            <button 
              className="copy-btn" 
              onClick={() => {
                navigator.clipboard.writeText(fixedCode);
                alert("Fixed code copied to clipboard!");
              }}
            >
              📋 Copy Fixed Code
            </button>
          </div>
          
          <div className="diff-container">
            <div className="diff-pane before-pane">
              <div className="diff-pane-header">Before</div>
              <div className="diff-code">
                <Editor
                  value={code}
                  onValueChange={() => {}}
                  highlight={(c) => {
                    const prismLangId = language === "html" ? "markup" : language;
                    const grammar = Prism.languages[prismLangId];
                    return grammar ? Prism.highlight(c, grammar, prismLangId) : c;
                  }}
                  padding={16}
                  style={{ fontFamily: '"Fira Code", monospace', fontSize: 14, minHeight: "200px" }}
                  disabled={true}
                />
              </div>
            </div>
            
            <div className="diff-pane after-pane">
              <div className="diff-pane-header">After</div>
              <div className="diff-code">
                <Editor
                  value={fixedCode}
                  onValueChange={() => {}}
                  highlight={(c) => {
                    const prismLangId = language === "html" ? "markup" : language;
                    const grammar = Prism.languages[prismLangId];
                    return grammar ? Prism.highlight(c, grammar, prismLangId) : c;
                  }}
                  padding={16}
                  style={{ fontFamily: '"Fira Code", monospace', fontSize: 14, minHeight: "200px" }}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />

    </div>
  );
}

export default App;
