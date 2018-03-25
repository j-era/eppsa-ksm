import client from "socket.io-client"

export default class ContentServer {
  constructor(uri) {
    this.socket = client(uri, { secure: true })
  }

  findGame(gameId) {
    return this.send("findGame", gameId)
  }

  newGame(name, avatar, maxChallenges) {
    return this.send("newGame", name, avatar, maxChallenges)
  }

  resumeGame(gameId, maxChallenges) {
    return this.send("resumeGame", gameId, maxChallenges)
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
}
