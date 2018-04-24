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
    return this.emitWithRepsonse("findGame", gameId)
  }

  findConnectedGames() {
    return this.emitWithRepsonse("findConnectedGames")
  }

  startGame(name, avatar, maxChallenges) {
    return this.emitWithRepsonse("startGame", name, avatar, maxChallenges)
  }

  resumeGame(gameId) {
    return this.emitWithRepsonse("resumeGame", gameId)
  }

  startChallenge() {
    this.socket.emit("startChallenge")
  }

  finishChallenge(result) {
    return this.emitWithRepsonse("finishChallenge", result)
  }

  joinChallengeLobby() {
    this.socket.emit("joinChallengeLobby")
  }

  leaveChallengeLobby() {
    this.socket.emit("leaveChallengeLobby")
  }

  sendToPeer(eventName, gameId, ...param) {
    this.socket.emit("sendToPeer", eventName, gameId, ...param)
  }

  emitWithRepsonse(eventName, ...param) {
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
    this.socket.io.opts.query = params
  }
}
