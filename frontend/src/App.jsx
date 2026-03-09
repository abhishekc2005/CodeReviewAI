import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import prism from "prismjs"
import Editor from "react-simple-code-editor"
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [code, setcode] = useState(`
                function sum(){
                 return 1+1
                }
                `)

  const [review, setreview] = useState('')

async function reviewCode(){

const response = await axios.post("https://codereviewai-backend.onrender.com/ai/get-review", {code})
setReview(response.data.review)
}
  
  useEffect(() => {
    prism.highlightAll()
  })

  return (
    <>
      <main>

        <div className="left">

          <div className="code">

            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 16,
                
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />


          </div>

          <div onClick={reviewCode} className="review">Review</div>

        </div>

        <div className="right">
          <ReactMarkdown>{review}</ReactMarkdown>
        </div>

      </main>
    </>
  )
}

export default App
