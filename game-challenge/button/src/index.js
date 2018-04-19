import React from "react"
import ReactDOM from "react-dom"
import bootstrap from "../node_modules/eppsa-ksm-shared/functions/bootstrap"

import "./index.css"
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
    contentServerUri={ config.challenge.contentServerUri }
    assetServerUri={ config.challenge.assetServerUri }
    gameServerUri={ config.challenge.gameServerUri }
    challengeNumber={ config.challenge.challengeNumber }
    sessionLength={ config.challenge.score.sessionLength }
    orientation={ orientation } />,
  document.getElementById("root"))
}
