import React from "react"
import ReactDOM from "react-dom"

import { injectGlobalStyle } from "./eppsa-ksm-shared/styled-components/globalStyle"

import App from "./App"
import bootstrap from "./eppsa-ksm-shared/functions/bootstrap"

bootstrap((data, config, callbacks) => {
  render(data, config, callbacks)
})

function render(data, callbacks) {
  console.log(callbacks)
  injectGlobalStyle(data.staticServerUri)

  ReactDOM.render(
    <App content={ data } completeChallenge={ callbacks.onCompleteChallenge } />,
    document.getElementById("root")
  )
}
