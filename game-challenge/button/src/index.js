import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import selectContent from "./selectContent"

let gameClient
let config
let orientation


const completeChallenge = () => {
  gameClient.source.postMessage(
    {
      source: "challenge",
      score: config.challenge.score.reward
    }, gameClient.origin)
}

// eslint-disable-next-line no-use-before-define
const url = new URL(window.location)

const contentServerUri = process.env.CONTENT_SERVER_URI || url.searchParams.get("contentServerUri")
const assetServerUri = process.env.ASSET_SERVER_URI || url.searchParams.get("assetServerUri")
const gameServerUri = process.env.GAME_SERVER_URI || url.searchParams.get("gameServerUri")
const challengeNumber = url.searchParams.get("challengeNumber")

window.addEventListener("message", receiveMessage, false)
function receiveMessage(event) {
  if (event.data.type === "challengeData") {
    gameClient = { source: event.source, origin: event.origin }
    config = selectContent(event.data.data)
  }
  if (event.data.type === "deviceOrientation") {
    orientation = event.data.data
  }

  ReactDOM.render(<App
    onClick={ completeChallenge }
    contentServerUri={ contentServerUri }
    assetServerUri={ assetServerUri }
    gameServerUri={ gameServerUri }
    challengeNumber={ challengeNumber }
    sessionLength={ config.scoreCalculation.sessionLength }
    orientation={ orientation } />,
  document.getElementById("root"))
}
