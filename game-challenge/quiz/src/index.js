import React from "react"
import ReactDOM from "react-dom"

import { injectGlobalStyle } from "../lib/eppsa-ksm-shared/styled-components/globalStyle"
import ContentServer from "../lib/eppsa-ksm-shared/api/contentServer"
import { transform } from "../lib/eppsa-ksm-shared/api/helpers"

import App from "./App"
import selectContent from "./selectContent"

const contentServerUrl = process.env.CONTENT_SERVER_URI
const assetServerUrl = process.env.ASSET_SERVER_URI
const staticServerUrl = process.env.STATIC_SERVER_URI

let gameClient

const completeChallenge = (score) => {
  gameClient.source.postMessage(
    {
      source: "challenge",
      score
    }, gameClient.origin)
}

function receiveMessage(event) {
  console.log(event)

  const data = event.data
  if (data.type !== "challengeData") {
    return
  }

  gameClient = { source: event.source, origin: event.origin }

  render(data.data, completeChallenge)
}

try {
  console.assert(window.parent.origin)

  // We are in the same window

  const url = new URL(window.location)

  const challengeNumber = url.searchParams.get("challengeNumber")
  if (!challengeNumber) {
    console.error("Missing challengeNumber query parameter.")
  } else {
    if (!contentServerUrl || !assetServerUrl || !staticServerUrl) {
      console.log(
        `Missing config parameter: ${contentServerUrl}, ${assetServerUrl}, ${staticServerUrl}`
      )
    } else {
      const contentServer = new ContentServer(contentServerUrl)
      contentServer.getData()
        .then((data) => {
          render(selectContent(transform(data), challengeNumber))
        })
    }
  }
} catch (e) {
  // We are in another window (iframe)
  window.addEventListener("message", receiveMessage, false)
}

function render(data) {
  injectGlobalStyle(staticServerUrl)

  const score = data.challenge["score-calculation"].reward

  ReactDOM.render(
    <App content={ data } completeChallenge={ () => completeChallenge(score) } />,
    document.getElementById("root")
  )
}
