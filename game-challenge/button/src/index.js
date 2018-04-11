import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"

let gameClient
let config

window.addEventListener("message", receiveMessage, false)
function receiveMessage(event) {
  console.log(event)
  gameClient = { source: event.source, origin: event.origin }
  config = event.data
}

const completeChallenge = () => {
  gameClient.source.postMessage(
    {
      source: "challenge",
      score: config.challenge["score-calculation"].reward
    }, gameClient.origin)
}

// eslint-disable-next-line no-use-before-define
const url = new URL(window.location)

const contentServerUri = process.env.CONTENT_SERVER_URI || url.searchParams.get("contentServerUri")
const assetServerUri = process.env.ASSET_SERVER_URI || url.searchParams.get("assetServerUri")
const gameServerUri = process.env.GAME_SERVER_URI || url.searchParams.get("gameServerUri")
const challengeNumber = url.searchParams.get("challengeNumber")

ReactDOM.render(<App
  onClick={ completeChallenge }
  contentServerUri={ contentServerUri }
  assetServerUri={ assetServerUri }
  gameServerUri={ gameServerUri }
  challengeNumber={ challengeNumber } />,
document.getElementById("root"))

function handleOrientation(event) {
  let x = event.beta // In degree in the range [-180,180]
  let y = event.gamma // In degree in the range [-90,90]

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x > 90) { x = 90 }
  if (x < -90) { x = -90 }

  // To make computation easier we shift the range of
  // x and y to [0,180]
  x += 90
  y += 90

  console.log(`x: ${x}, y: ${y}`)
}

window.addEventListener("deviceorientation", handleOrientation)
