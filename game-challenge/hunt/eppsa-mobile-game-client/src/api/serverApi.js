/* eslint-disable no-unused-vars,import/no-extraneous-dependencies */
import client from "socket.io-client"

export default class ServerApi {
  constructor(wsServerUrl = "", path = "") {
    this.socket = client(wsServerUrl, {
      path: `${path}/socket.io`
    })
  }

  get id() {
    return this.socket.id
  }

  setName(name) {
    this.socket.emit("setName", name)
  }

  playSolo() {
    this.socket.emit("playSolo")
  }

  playWith(player) {
    this.socket.emit("playWith", player)
  }

  cancelRequestToPlay(player) {
    this.socket.emit("cancelPlayWith", player)
  }

  acceptInvite(fromPlayer) {
    this.socket.emit("acceptInvite", fromPlayer)
  }

  itemScanned(item) {
    this.socket.emit("itemScanned", item)
  }

  on(event, fn) {
    this.socket.on(event, fn)
  }
}
