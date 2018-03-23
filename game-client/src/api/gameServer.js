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

  startChallenge(gameId) {
    this.send("startChallenge", gameId)
  }

  finishChallenge(gameId, result) {
    return this.send("finishChallenge", gameId, result)
  }

  send(eventName, ...param) {
    return new Promise((resolve) => {
      this.socket.emit(eventName, ...param, result => {
        resolve(result)
      })
    })
  }
}
