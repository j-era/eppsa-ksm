const uuid = require("uuid/v4")

module.exports = class Client {
  constructor(socket, mongoDB, log) {
    this.socket = socket
    this.mongoDB = mongoDB
    this.log = log
    this.game = null

    this.log.info({ socketId: this.socket.id }, "Client connected")
  }

  async subscribe() {
    await this.tryContinueGame()

    this.socket.on("findGame", this.findGame.bind(this))
    this.socket.on("findRecentFinishedGames", this.findRecentFinishedGames.bind(this))
    this.socket.on("findHighscoreGames", this.findHighscoreGames.bind(this))
    this.socket.on("findConnectedGames", this.findConnectedGames.bind(this))
    this.socket.on("startGame", this.startGame.bind(this))
    this.socket.on("resumeGame", this.resumeGame.bind(this))
    this.socket.on("startChallenge", this.startChallenge.bind(this))
    this.socket.on("finishChallenge", this.finishChallenge.bind(this))
    this.socket.on("joinChallengeLobby", this.joinChallengeLobby.bind(this))
    this.socket.on("leaveChallengeLobby", this.leaveChallengeLobby.bind(this))
    this.socket.on("sendDirectMessage", this.sendDirectMessage.bind(this))
    this.socket.on("joinRoom", this.joinRoom.bind(this))
    this.socket.on("disconnect", this.onDisconnect.bind(this))
    this.socket.conn.on("packet", this.onPacket.bind(this))
  }

  async tryContinueGame() {
    const gameId = this.socket.handshake.query.gameId
    if (gameId) {
      const game = await this.mongoDB.findGame(gameId)

      if (game) {
        this.log.info({ socketId: this.socket.id, gameId }, "Continuing game")
        this.mongoDB.connectGame(gameId, this.socket.id)
        this.game = game
      } else {
        this.log.error({ socketId: this.socket.id, gameId }, "Could not continue game")
      }
    }
  }

  async startGame(name, avatar, maxChallenges, toSocket) {
    this.disconnectGame()

    this.game = {
      gameId: uuid(),
      name,
      avatar,
      score: 0,
      challengeNumber: 1,
      maxChallenges,
      inLobby: false,
      finished: false
    }

    this.log.info({ socketId: this.socket.id, game: this.game }, "Starting a new game")

    this.mongoDB.startGame(this.game, this.socket.id)
    toSocket(this.game)
  }

  async resumeGame(gameId, toSocket) {
    this.disconnectGame()

    const game = await this.mongoDB.findGame(gameId)
    if (game && !game.finished) {
      this.log.info({ socketId: this.socket.id, gameId }, "Resuming game")

      this.mongoDB.resumeGame(gameId, this.socket.id, { inLobby: false })
      this.game = game
    } else {
      this.log.error({ socketId: this.socket.id, gameId }, "Could not resume game ")
    }

    toSocket(this.game)
  }

  async joinChallengeLobby() {
    if (this.game) {
      this.log.info({
        socketId: this.socket.id,
        gameId: this.game.gameId,
        challengeNumber: this.game.challengeNumber
      },
      "Joining challenge lobby")

      this.mongoDB.updateGame(this.game.gameId, { inLobby: true })
    } else {
      this.log.error({ socketId: this.socket.id },
        "Could not join challenge lobby without current game")
    }
  }

  async leaveChallengeLobby() {
    if (this.game) {
      this.log.info({
        socketId: this.socket.id,
        gameId: this.game.gameId,
        challengeNumber: this.game.challengeNumber
      },
      "Leaving challenge lobby")

      this.mongoDB.updateGame(this.game.gameId, { inLobby: false })
    } else {
      this.log.error({ socketId: this.socket.id },
        "Could not leave challenge lobby without current game")
    }
  }

  async sendDirectMessage(message, gameId, payload) {
    if (this.game) {
      const socketId = await this.mongoDB.findSocketId(gameId)

      this.log.info({
        from: this.game.gameId,
        to: gameId,
        socketId,
        message,
        payload
      }, "Delivering message")

      this.socket.nsp.to(socketId).emit("directMessage", message, this.game.gameId, payload)
    }
  }

  async startChallenge() {
    if (this.game) {
      this.log.info({
        socketId: this.socket.id,
        gameId: this.game.gameId,
        challengeNumber: this.game.challengeNumber
      },
      "Starting challenge")

      this.mongoDB.startChallenge(this.game.gameId, this.game.challengeNumber)
    } else {
      this.log.error({ socketId: this.socket.id }, "Could not start challenge without current game")
    }
  }

  async finishChallenge(result, toSocket) {
    if (this.game) {
      this.log.info({ socketId: this.socket.id, gameId: this.game.gameId },
        "Finishing challenge")

      if (await this.mongoDB.finishChallenge(this.game.gameId, this.game.challengeNumber, result)) {
        this.game.score += result.score
        this.game.challengeNumber++

        if (this.game.challengeNumber > this.game.maxChallenges) {
          this.game.finished = true
          this.log.info({ socketId: this.socket.id, gameId: this.game.gameId },
            "Game finished")
        }

        this.mongoDB.updateGame(this.game.gameId, this.game)
      }
    } else {
      this.log.error({ socketId: this.socket.id },
        "Could not finish challenge without current game")
    }

    toSocket(this.game)
  }

  joinRoom(room) {
    this.socket.join(room, (error) => {
      if (error) {
        this.log.error({ socketId: this.socket.id, room }, "Could not join room")
      } else {
        this.emitClientsInRoom(room)
        this.socket.on("disconnect", () => this.emitClientsInRoom(room))
        this.log.info({ socketId: this.socket.id, room }, "Client joined room")
      }
    })
  }

  emitClientsInRoom(room) {
    const roomObj = this.socket.nsp.adapter.rooms[room]
    if (roomObj) {
      this.socket.nsp.to(room).emit("clientsInRoom", Object.keys(roomObj.sockets))
    }
  }

  async findGame(gameId, toSocket) {
    toSocket(await this.mongoDB.findGame(gameId))
  }

  async findRecentFinishedGames(toSocket) {
    toSocket(await this.mongoDB.findRecentFinishedGames())
  }

  async findHighscoreGames(toSocket) {
    toSocket(await this.mongoDB.findHighscoreGames())
  }

  async findConnectedGames(toSocket) {
    toSocket(await this.mongoDB.findConnectedGames())
  }

  onDisconnect() {
    if (this.game) {
      this.log.info({ socketId: this.socket.id, gameId: this.game.gameId },
        "Client disconnected with gameId")

      this.disconnectGame()
    } else {
      this.log.info({ socketId: this.socket.id }, "Client disconnected")
    }
  }

  onPacket() {
    if (this.game) {
      this.mongoDB.updateGame(this.game.gameId)
    }
  }

  disconnectGame() {
    if (this.game) {
      this.mongoDB.disconnectGame(this.game.gameId)
      this.game = null
    }
  }
}
