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
    return this.emit("findGame", gameId)
  }

  findConnectedGames() {
    return this.emit("findConnectedGames")
  }

  startGame(name, avatar, maxChallenges) {
    return this.emit("startGame", name, avatar, maxChallenges)
  }

  resumeGame(gameId) {
    return this.emit("resumeGame", gameId)
  }

  startChallenge() {
    this.emit("startChallenge")
  }

  finishChallenge(result) {
    return this.emit("finishChallenge", result)
  }

  joinChallengeLobby() {
    return this.emit("joinChallengeLobby")
  }

  leaveChallengeLobby() {
    return this.emit("leaveChallengeLobby")
  }

  sendDirectMessage(message, gameId) {
    this.emit("sendDirectMessage", message, gameId)
  }

  emit(eventName, ...param) {
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
