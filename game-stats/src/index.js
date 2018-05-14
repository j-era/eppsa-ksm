import React from "react"
import ReactDOM from "react-dom"
import socketIOClient from "socket.io-client"

import App from "./App"


const client = socketIOClient("https://mongo.marco.eppsa.de")


ReactDOM.render(
  <App
    client={ client }
  />,
  document.getElementById("root")
)
