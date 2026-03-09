import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";   // important
import Editor from "react-simple-code-editor";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import "./App.css";

function App() {

  const [code, setCode] = useState(`function sum(){
  return 1 + 1
}`);

  const [review, setReview] = useState("");

  const reviewCode = async () => {
    try {
      const response = await axios.post(
        "https://codereviewai-backend.onrender.com/ai/get-review",
        { code }
      );

      setReview(response.data.review);

    } catch (error) {
      console.error("Error reviewing code:", error);
      setReview("⚠️ Failed to fetch review. Please try again.");
    }
  };

  // run only once
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <main>

      <div className="left">

        <div className="code">

          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 16,
              border: "1px solid #ddd",
              borderRadius: "5px",
              height: "100%",
              width: "100%"
            }}
          />

        </div>

        <div className="review" onClick={reviewCode}>
          Review
        </div>

      </div>

      <div className="right">
        <ReactMarkdown>{review}</ReactMarkdown>
      </div>

    </main>
  );
}

export default App;
