import React from "react"
import ReactDOM from "react-dom"

import Server from "./api/server"

init()

console.log(process.env.CONTENT_SERVER_URI + " " + process.env.ASSET_SERVER_URI + " " + process.env.GAME_SERVER_URI)

async function init() {
  const server = new Server(process.env.GAME_SERVER_URI)
  const gameId = await server.newGame("Foo", 1)
  console.log(gameId)
}

ReactDOM.render(
  <div>
    <p>React here!</p>
  </div>,
  document.getElementById("app")
)
