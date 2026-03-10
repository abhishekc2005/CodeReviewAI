import { useState } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import Editor from "react-simple-code-editor";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import "./App.css";
import Footer from "./components/Footer";

function App() {

  const [code, setCode] = useState("// ✨ Write or paste your code here to review");
  const [review, setReview] = useState("Your AI code review will appear here...");
  const [loading, setLoading] = useState(false);

  const reviewCode = async () => {

    if (loading) return;

    if (!code || code.trim().length < 5) {
      setReview("⚠️ Please write or paste some code first.");
      return;
    }

    setLoading(true);
    setReview("⏳ Reviewing your code with AI...");

    try {

      const response = await axios.post(
        "https://codereviewai-backend.onrender.com/ai/get-review",
        { code }
      );

      const aiReview = response?.data?.review;

      if (aiReview) {
        setReview(aiReview);
      } else {
        setReview("⚠️ AI returned no review.");
      }

    } catch (error) {

      console.error("Review API Error:", error);

      if (error.response?.status === 429) {
        setReview("⚠️ Too many requests. Please wait a few seconds.");
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

      <main>

        <div className="left">

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
              padding={10}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 16,
                minHeight: "300px"
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

          <h3>AI Review</h3>

          <ReactMarkdown>
            {review}
          </ReactMarkdown>

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default App;
