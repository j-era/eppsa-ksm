import React from "react"
import ReactDOM from "react-dom"
import { bootstrap } from "eppsa-ksm-shared"

import App from "./App"

let orientation

bootstrap((config, { callbacks }) => {
  render(config, callbacks)

  window.addEventListener("message", (event) => {
    if (event.data.type === "deviceOrientation") {
      orientation = event.data.data
      render(config, callbacks)
    }
  }, false)
})

function render(config, callbacks) {
  ReactDOM.render(<App
    onClick={ () => callbacks.finishChallenge(config.challenge.score.reward) }
    assetServerUri={ config.assetServerUri }
    gameServerUri={ config.gameServerUri }
    room={ config.room }
    orientation={ orientation } />,
  document.getElementById("app"))
}
