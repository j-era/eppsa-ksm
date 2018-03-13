import client from "socket.io-client"

export default class ContentServer {
  constructor(uri) {
    this.socket = client(uri, { secure: true })
  }

  newGame(name, avatar) {
    return this.send("newGame", name, avatar)
  }

  resumeGame(gameId) {
    return this.send("resumeGame", gameId)
  }

  startChallenge() {
    this.send("startChallenge")
  }

  completeChallenge(result) {
    this.send("completeChallenge", result)
  }

  send(eventName, ...param) {
    return new Promise((resolve) => {
      this.socket.emit(eventName, ...param, result => {
        resolve(result)
      })
    })
  }
}
