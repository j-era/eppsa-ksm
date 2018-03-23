import React from "react"
import ReactDOM from "react-dom"
import { keys, pickBy } from "lodash"
import "./index.css"
import App from "./App"


let gameClient
let config

function getChildren(parent, template) {
  return keys(pickBy(parent, child => child.template === template)).map(key => parent[key])
}

window.addEventListener("message", receiveMessage, false)

function receiveMessage(event) {
  console.log(event)
  gameClient = { source: event.source, origin: event.origin }
  config = {
    question: event.data.question,
    reward: event.data.reward,
    answers: getChildren(event.data, "quizAnswer")
  }
  ReactDOM.render(
    <App config={ config } completeChallenge={ completeChallenge } />,
    document.getElementById("root")
  )
}

function completeChallenge(score) {
  gameClient.source.postMessage(
    {
      source: "challenge",
      score
    }, gameClient.origin)
}
