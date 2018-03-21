import client from "socket.io-client"

export default class ContentServer {
  constructor(uri) {

    const ioOptions = {
      secure: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 1000,
      randomizationFactor: 0,
      timeout: 5000
    }

    this.socket = client(uri, ioOptions)

    this.socket.on("disconnect", reason => {
      console.log(`disconnected because of ${reason}`)
    })

    this.socket.on("connect", () => {
      console.log(`connected as ${this.socket.id}`)
    })

    this.socket.on("reconnect", attempt => {
      console.log(`reconnected after ${attempt} attempts`)
    })

    this.socket.on('reconnecting', attemptNumber => {
      console.log(`reconnecting for the ${attemptNumber}. time`)
    })

    setInterval(async () => {
      console.log("send ping")
      console.log("got " + await this.send("pingo"))
    }, 1000)

  }

  getGameInfo(gameId) {
    return this.send("getGameInfo", gameId)
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
    return this.send("completeChallenge", result)
  }

  send(eventName, ...param) {
    return new Promise((resolve) => {
      this.socket.emit(eventName, ...param, result => {
        resolve(result)
      })
    })
  }
}
