import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"

const config = {
  question: "What is your favorite color?",
  reward: 1000,
  answers: [
    {
      answer: "Green",
      isCorrect: true
    },
    {
      answer: "Blue. No, red!",
      isCorrect: false
    },
    {
      answer: "42",
      isCorrect: false
    },
    {
      answer: "Dunno",
      isCorrect: false
    }
  ]
}

function completeChallenge(score) {
  console.log(`player got score: ${score}`)
}

ReactDOM.render(
  <App config={ config } completeChallenge={ completeChallenge } />,
  document.getElementById("root")
)
