import React from "react"
import ReactDOM from "react-dom"
import { injectGlobal } from "styled-components"

import App from "./App"

injectGlobal`
  
  @import url('https://fonts.googleapis.com/css?family=Cabin:400,700');

  html, body {
    width: 100%;
    height: 100%;
    
    margin: 0%;
    padding: 0%;
    
    font-family: 'Cabin', sans-serif;
  }
  
  #root {
      height: 100%;
    }
`

ReactDOM.render(
  <App />,
  document.getElementById("root")
)
