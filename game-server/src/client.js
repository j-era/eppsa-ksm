const uuid = require("uuid/v4")

module.exports = class Client {
  constructor(socket, mongoDB, log) {
    this.socket = socket
    this.mongoDB = mongoDB
    this.log = log
    this.currentGame = null
  }

  subscribe() {
    this.socket.on("findGame", this.findGame.bind(this))
    this.socket.on("findActiveGames", this.findActiveGames.bind(this))
    this.socket.on("newGame", this.newGame.bind(this))
    this.socket.on("resumeGame", this.resumeGame.bind(this))
    this.socket.on("startChallenge", this.startChallenge.bind(this))
    this.socket.on("finishChallenge", this.finishChallenge.bind(this))
    this.socket.conn.on("packet", this.onPacket.bind(this))
  }

  async findGame(gameId, toSocket) {
    toSocket(await this.mongoDB.findGame(gameId))
  }

  async findActiveGames(toSocket) {
    toSocket(await this.mongoDB.findActiveGames())
  }

  async newGame(name, avatar, maxChallenges, toSocket) {
    this.log.info({ playerName: name, avatar, maxChallenges }, "Starting a new game")

    const game = {
        gameId: uuid(),
        finished: false,
        name,
        avatar,
        score: 0,
        challengeNumber: 1,
        maxChallenges,
        startTime: new Date()
      }

    this.currentGame = game
    this.mongoDB.newGame(game)
    toSocket(game)
  }

  async resumeGame(gameId, maxChallenges, toSocket) {
    this.log.info({ gameId, maxChallenges }, "Resuming game")

    const game = await this.mongoDB.findGame(gameId)
    if (game) {
      game.maxChallenges = maxChallenges
      handleGameFinished(game)
      
      this.mongoDB.updateGame(game)
      this.currentGame = game
    } else {
      this.log.error({ gameId }, "Could not find game in database")
    }

    toSocket(game)
  }

  async startChallenge() {
    if (this.currentGame) {
      this.log.info({ gameId: this.currentGame.gameId }, "Starting challenge")
      
      const challenge = { gameId: this.currentGame.gameId, startTime: new Date() }
      this.mongoDB.startChallenge(this.currentGame.challengeNumber, challenge)
    } else {
      this.log.error("Could not start challenge without current game")
    }
  }

  async finishChallenge(result, toSocket) {
    if (this.currentGame) {
      this.log.info({ gameId: this.currentGame.gameId }, "Finishing challenge")

      const challenge = { gameId: this.currentGame.gameId, finishTime: new Date(), ...result }
      this.mongoDB.finishChallenge(this.currentGame.challengeNumber, challenge)

      this.currentGame.score += result.score
      this.currentGame.challengeNumber++
      handleGameFinished(this.currentGame)

      this.mongoDB.updateGame(this.currentGame)
    } else {
      this.log.error("Could not finish challenge without current game")
    }

    toSocket(this.currentGame)
  }

  onPacket(packet) {
    if (this.currentGame) {
      this.currentGame.lastUpdate = new Date()
      this.mongoDB.updateGame(this.currentGame, false)
    }
  }
}

function handleGameFinished(game) {
  if (!game.finished && game.challengeNumber > game.maxChallenges) {
    game.finished = true
    game.finishTime = new Date()
  }
}