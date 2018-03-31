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

  findRecentFinishedGames() {
    return this.send("findRecentFinishedGames")
  }

  findHighscoreGames() {
    return this.send("findHighscoreGames")
  }

  findConnectedGames() {
    return this.send("findConnectedGames")
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
}
