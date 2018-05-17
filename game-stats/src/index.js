import React from "react"
import ReactDOM from "react-dom"
import socketIOClient from "socket.io-client"

import App from "./App"


const client = socketIOClient(process.env.MONGO_ACCESS_URI)


ReactDOM.render(
  <App client={ client } />,
  document.getElementById("root")
)
