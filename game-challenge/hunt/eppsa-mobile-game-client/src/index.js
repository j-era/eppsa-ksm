import querystring from "querystring"
import React from "react"
import ReactDOM from "react-dom"

import App from "./components/app"
import Server from "./api/serverApi"
import registerServiceWorker from "./registerServiceWorker"
import content from "./Content"

const params = querystring.parse(window.location.search.substring(1))

const gitJsonApiUrl = params.gitJsonApi || "https://content-server.marco.eppsa.de" +
  "/master/content/challenges/1/challengeTypes/hunt"
const wsServerUrl = params.wsServer || ""
const wsServerPath = params.wsServerPath || process.env.WS_SERVER_PATH

content.loadCmsData(gitJsonApiUrl).then(() => {
  document.title = content.data.game.name
  ReactDOM.render(
    <App
      server = { new Server(wsServerUrl, wsServerPath) }
      content = { content } />,
    document.getElementById("root")
  )
})

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

registerServiceWorker()
