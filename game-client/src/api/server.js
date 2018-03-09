import client from "socket.io-client"

export default class Server {
  constructor(server) {
    this.socket = client(server, { secure: true })
  }

  newGame(name, avatar) {
    return this.send("newGame", name, avatar)
  }

  send(eventName, ...param) {
    return new Promise((resolve) => {
      this.socket.emit(eventName, ...param, result => {
        resolve(result)
      })
    })
  }
}
