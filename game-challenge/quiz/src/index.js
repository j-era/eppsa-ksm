import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import "./index.css"
import selectContent from "./selectContent"


let gameClient
let config

window.addEventListener("message", receiveMessage, false)

function receiveMessage(event) {
  console.log(event)
  gameClient = { source: event.source, origin: event.origin }
  config = selectContent(event.data)
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
