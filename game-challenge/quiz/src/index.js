import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import "./index.css"
import selectContent from "./selectContent"


window.addEventListener("message", receiveMessage, false)

function receiveMessage(event) {
  console.log(event)
  const content = selectContent(event.data)
  console.log(content.scoreCalculation)
  ReactDOM.render(
    <App content={ content } completeChallenge={ score =>
      event.source.postMessage({ source: "challenge", score }, event.origin) } />,
    document.getElementById("root")
  )
}
