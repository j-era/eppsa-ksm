import client from "socket.io-client"

export default class GameServer {
  constructor(uri) {
    this.socket = client(uri, { secure: true })

    this.socket.on("disconnect", reason => {
      console.log(`Disconnected because of ${reason}`)
    })

    this.socket.on("connect", () => {
      console.log(`Connected with socket id ${this.socket.id}`)
    })

    this.socket.on("reconnect", attempt => {
      console.log(`Reconnected after ${attempt} attempts`)
    })

    this.socket.on("reconnecting", attemptNumber => {
      console.log(`Reconnecting for the ${attemptNumber}. time`)
    })
  }

  findGame(gameId) {
    return this.send("findGame", gameId)
  }

  findConnectedGames() {
    return this.send("findConnectedGames")
  }

  startGame(name, avatar, maxChallenges) {
    return this.send("startGame", name, avatar, maxChallenges)
  }

  resumeGame(gameId) {
    return this.send("resumeGame", gameId)
  }

  startChallenge() {
    this.send("startChallenge")
  }

  finishChallenge(result) {
    return this.send("finishChallenge", result)
  }

  send(eventName, ...param) {
    return new Promise((resolve) => {
      this.socket.emit(eventName, ...param, result => {
        resolve(result)
      })
    })
  }

  on(event, callback) {
    this.socket.on(event, callback)
  }

  setHandshakeQuery(params) {
    console.log(`Set reconnect options: ${params}`)
    this.socket.io.opts.query = params
  }
}
