import React from "react"
import ReactDOM from "react-dom"

import { injectGlobalStyle } from "../node_modules/eppsa-ksm-shared/styled-components/globalStyle"

import App from "./App"
import bootstrap from "../node_modules/eppsa-ksm-shared/functions/bootstrap"

bootstrap((data, onCompleteChallenge) => {
  render(data, onCompleteChallenge)
})

function render(data, onCompleteChallenge) {
  injectGlobalStyle(data.staticServerUri)
  ReactDOM.render(
    <App data={ data } completeChallenge={ onCompleteChallenge } />,
    document.getElementById("root")
  )
}
