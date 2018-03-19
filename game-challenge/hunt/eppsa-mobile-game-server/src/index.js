/* eslint-disable import/no-commonjs */

const express = require("express")
const fs = require("fs")
const http = require("http")
const socketIO = require("socket.io")

const pres = ["One", "Wood", "Two", "Long", "Short", "Sharp", "Wicked",
  "Black", "Brown", "Red", "Twitchy", "Grumpy", "No", "Big", "Small", "Tiny", "Green"]
const parts = ["Eye", "Beard", "Leg", "Hand", "Saber", "Knee", "Elbow", "Nose", "Chin", "Thumb"]
const names = ["Jimmy", "Bob", "Roland", "Whitman", "Delbert"]

console.log(`${pres.length * parts.length * names.length} available names`)

const PORT = process.env.PORT

const ioOptions = {
  pingTimeout: 1000 * 15,
  pingInterval: 1000 * 10
}

const app = express()
const server = http.createServer(app)
const io = socketIO(server, ioOptions)

const playerNames = []
const waitingPlayers = []
const runningGames = []

server.listen(PORT, () => {
  console.log(`Example listening on port ${PORT}!`)
})

io.on("connection", (socket) => {
  console.log(`${socket.id} A user connected.`)

  const player = { id: socket.id, name: getName() }
  const game = []

  waitingPlayers.push(player)
  console.log(`waitingPlayers: ${JSON.stringify(waitingPlayers)}`)

  socket.emit("init", player)

  sendWaitingPlayers()

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`)

    removeFromWaitinglist(player)
    playerNames.splice(playerNames.indexOf(player.name), 1)
    console.log(`waitingPlayers: ${JSON.stringify(waitingPlayers)}`)

    sendWaitingPlayers()
  })

  socket.on("playSolo", () => console.log(`${socket.id} wants to play solo`))

  socket.on("playWith", targetPlayer => {
    socket.to(targetPlayer.id).emit("playRequest", player)
    console.log(`${player.id} wants to play with ${targetPlayer.id}`)
  })

  socket.on("cancelPlayWith", targetPlayer => {
    socket.to(targetPlayer.id).emit("cancelPlayRequest", player)
    console.log(`${player.id} canceled request to play with ${targetPlayer.id}`)
  })

  socket.on("acceptInvite", fromPlayer => {
    console.log(`${player.id} accepts ${fromPlayer.id} Invite`)
    game.push(player)

    game.push(waitingPlayers[waitingPlayers.findIndex(
      currentPlayer => isSamePlayer(currentPlayer, fromPlayer))])

    removeFromWaitinglist(fromPlayer)
    removeFromWaitinglist(player)

    runningGames.push(game)

    sendWaitingPlayers()

    socket.emit("startGame", game)
    socket.to(fromPlayer.id).emit("startGame", game)
  })

  socket.on("ready", ({ ready, partner }) => {
    socket.to(partner.id).emit("partnerFinishedQuests", ready)
    console.log(`${socket.id} is ready`)
  })

  socket.on("setName", name => {
    player.name = name.trim()
    sendWaitingPlayers()
  })

  socket.on("itemScanned", item => {
    console.log(`${socket.id} scanned ${item}`)
  })
})

function removeFromWaitinglist(player) {
  const index = waitingPlayers.findIndex(currentPlayer => isSamePlayer(currentPlayer, player))
  if (index >= 0) {
    waitingPlayers.splice(index, 1)
  }
}

function sendWaitingPlayers() {
  io.emit("players", waitingPlayers)
}

function getRandomEleent(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getName() {
  const name = `${getRandomEleent(pres)} ${getRandomEleent(parts)} ${getRandomEleent(names)}`
  if (playerNames.includes(name)) {
    return getName()
  } else {
    playerNames.push(name)
    return name
  }
}

function isSamePlayer(currentPlayer, searchedPlayer) {
  return currentPlayer.id === searchedPlayer.id
}
