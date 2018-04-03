const MongoClient = require("mongodb").MongoClient
const EventEmitter = require("events")

const MONGODB_URI = `${process.env.MONGODB_URI}:27017`
const DATABASE_NAME = "EPPSA_KSM"
const GAMES_COLLECTION = "games"
const GAME_PROJECTION = { gameId: 1, name: 1, avatar: 1, score: 1, challengeNumber: 1, _id: 0 }

module.exports = class MongoDB extends EventEmitter {
  constructor(log) {
    super()
    this.log = log
  }

  async connect() {
    const client = await MongoClient.connect(MONGODB_URI)
    this.database = client.db(DATABASE_NAME)
  }

  disconnectGames() {
    return this.database.collection(GAMES_COLLECTION).update(
      { connected: true }, { connected: false }
    )
  }

  findGame(gameId) {
    return this.database.collection(GAMES_COLLECTION)
      .find({ gameId }).limit(1).next()
  }

  findRecentFinishedGames() {
    const filter = { finished: true }
    const sort = { finishTime: -1 }
    return this.database.collection(GAMES_COLLECTION)
      .find(filter).project(GAME_PROJECTION).sort(sort).limit(10).toArray()
  }

  findHighscoreGames() {
    const filter = { finished: true }
    const sort = { score: -1 }
    return this.database.collection(GAMES_COLLECTION)
      .find(filter).project(GAME_PROJECTION).sort(sort).limit(10).toArray()
  }

  findConnectedGames() {
    const filter = { connected: true }
    return this.database.collection(GAMES_COLLECTION)
      .find(filter).project(GAME_PROJECTION).toArray()
  }

  async newGame(game) {
    await this.database.collection(GAMES_COLLECTION).insertOne(game)
    await this.emit("connectedGames", await this.findConnectedGames())
  }

  async updateGame(game, emitUpdate = true) {
    await this.database.collection(GAMES_COLLECTION)
      .updateOne({ gameId: game.gameId }, { $set: game })

    if (emitUpdate) {
      await this.emit("connectedGames", await this.findConnectedGames())

      if (game.finished) {
        await this.emit("recentFinishedGames", await this.findRecentFinishedGames())
        await this.emit("highscoreGames", await this.findHighscoreGames())
      }
    }
  }

  async startChallenge(gameId, number, data) {
    const challenge = { gameId, finished: false, ...data }
    await this.database.collection(`challenge-${number}`).insertOne(challenge)
  }

  async finishChallenge(gameId, number, data) {
    const filter = await this.database.collection(`challenge-${number}`)
      .find({ gameId, finished: false })
      .sort({ startTime: -1 })
      .limit(1).next()

    if (!filter) {
      this.log.error({ number, challenge }, "Could not find challenge in database to be finished")
      return false
    }

    const challenge = { finished: true, ...data }
    await this.database.collection(`challenge-${number}`).updateOne(filter, { $set: challenge })
    return true
  }
}
