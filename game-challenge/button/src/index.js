import React from "react"
import ReactDOM from "react-dom"
import client from "socket.io-client"
import bootstrap from "../node_modules/eppsa-ksm-shared/functions/bootstrap"

import App from "./App"

let socket
let orientation

bootstrap((config, { callbacks }) => {
  if (config.room) {
    socket = client(config.gameServerUri, { secure: true })
    socket.on("clientsInRoom", (clientsInRoom) => {
      console.log(`Clients in the room: ${JSON.stringify(clientsInRoom)}`)
  
      if (clientsInRoom.length > 1) {
        socket.emit("sendToRoom", "HELLO", config.room, "foo", "bar", "baz")
      }
    })

    socket.on("HELLO", (socketId, foo, bar, baz) =>
      console.log(`HELLO in the room: ${foo} ${bar} ${baz}`)
    )
    
    socket.on("connect", () => {
      socket.emit("joinRoom", config.room)
    })
  }

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
