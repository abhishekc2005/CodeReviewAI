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

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const reviewCode = async () => {

    if (loading) return;

    setLoading(true);
    setReview("Reviewing your code...");

    try {

      const response = await axios.post(
        "https://codereviewai-backend.onrender.com/ai/get-review",
        { code }
      );

      setReview(response?.data?.review || "No review returned");

    } catch (error) {

      console.error(error);

      if (error.response?.status === 429) {
        setReview("Too many requests. Please wait a few seconds.");
      } else {
        setReview("Server error. Try again later.");
      }

    } finally {
      setLoading(false);
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
                fontSize: 16
              }}
            />

          </div>

          <button className="review" onClick={reviewCode}>
            {loading ? "Reviewing..." : "Review Code"}
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
