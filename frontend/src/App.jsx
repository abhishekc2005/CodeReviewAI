import { useState, useEffect } from "react";
import Footer from "./componenets/Footer";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import Editor from "react-simple-code-editor";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import "./App.css";

function App() {

  const [code, setCode] = useState(`// ✨ Write or paste your code here to review

`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");

  const reviewCode = async () => {

    if (loading) return;

    setLoading(true);
    setReview("⏳ Reviewing your code...");

    try {

      const response = await axios.post(
        "https://codereviewai-backend.onrender.com/ai/get-review",
        { code, language }
      );

      setReview(response.data.review);

    } catch (error) {

      if (error.response?.status === 429) {
        setReview("⚠️ Too many requests. Please wait a few seconds.");
      } else {
        setReview("⚠️ Failed to fetch review.");
      }

    } finally {
      setLoading(false);
    }
  };

  const copyReview = () => {

    navigator.clipboard.writeText(review);
    alert("Review copied!");
  };

  useEffect(() => {

    Prism.highlightAll();

  }, [code]);

  return (
    <main>

      return (
  <>
    <main>
      {/* your editor and review UI */}
    </main>

    <Footer />
  </>
);

      <div className="left">

        <div className="toolbar">

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >

            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c">C / C++</option>

          </select>

        </div>

        <div className="code">

          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              Prism.highlight(
                code,
                Prism.languages[language] || Prism.languages.javascript,
                language
              )
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 16,
              height: "100%",
              width: "100%"
            }}
          />

        </div>

        <button
          className="review"
          onClick={reviewCode}
          disabled={loading}
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>

      </div>

      <div className="right">

        <div className="review-header">

          <h3>AI Review</h3>

          {review && !loading && (
            <button onClick={copyReview}>
              Copy
            </button>
          )}

        </div>

        {loading ? (
          <div className="loader"></div>
        ) : (
          <ReactMarkdown>{review}</ReactMarkdown>
        )}

      </div>

    </main>
  );
}

export default App;
