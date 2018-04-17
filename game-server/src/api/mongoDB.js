const MongoClient = require("mongodb").MongoClient
const EventEmitter = require("events")

const MONGODB_URI = `${process.env.MONGODB_URI}:27017`
const DATABASE_NAME = "EPPSA_KSM"
const GAMES_COLLECTION = "games"
const GAME_PROJECTION = {
  startTime: 0,
  finishTime: 0,
  lastUpdate: 0,
  disconnects: 0,
  connected: 0,
  _id: 0
}

module.exports = class MongoDB extends EventEmitter {
  constructor(log) {
    super()
    this.log = log
  }

  async connect() {
    const client = await MongoClient.connect(MONGODB_URI)
    this.database = client.db(DATABASE_NAME)
  }

  async startGame(game, socketId) {
    const gameData = {
      ...game,
      disconnects: 0,
      resumes: 0,
      connected: true,
      socketId,
      lastUpdate: new Date(),
      startTime: new Date()
    }

    await this.database.collection(GAMES_COLLECTION).insertOne(gameData)
    await this.emit("connectedGames", await this.findConnectedGames())
  }

  async resumeGame(gameId, socketId, set) {
    this.updateGame(gameId, { socketId, connected: true, ...set }, { resumes: 1 })
  }

  async startChallenge(gameId, number) {
    const challenge = { gameId, finished: false, startTime: new Date() }
    await this.database.collection(`challenge-${number}`).insertOne(challenge)
  }

  async finishChallenge(gameId, number, result) {
    const filter = await this.database.collection(`challenge-${number}`)
      .find({ gameId, finished: false })
      .sort({ startTime: -1 })
      .limit(1).next()

    if (!filter) {
      this.log.error({ gameId, number }, "Could not find challenge in database to be finished")
      return false
    }

    const set = { $set: { finished: true, finishTime: new Date(), ...result } }
    await this.database.collection(`challenge-${number}`).updateOne(filter, set)
    return true
  }

  async connectGame(gameId, socketId) {
    this.updateGame(gameId, { socketId, connected: true })
  }

  async disconnectGame(gameId) {
    this.updateGame(gameId, { connected: false }, { disconnects: 1 })
  }

  async updateGame(gameId, set = null, increment = null) {
    const lastUpdate = new Date()
    const update = { $set: { ...set, lastUpdate } }

    if (increment) {
      update.$inc = increment
    }

    await this.database.collection(GAMES_COLLECTION).updateOne({ gameId }, update)

    if (set || increment) {
      await this.emit("connectedGames", await this.findConnectedGames())

      if (update.$set.finished === true) {
        await this.emit("recentFinishedGames", await this.findRecentFinishedGames())
        await this.emit("highscoreGames", await this.findHighscoreGames())
      }
    }
  }

  ensureAllGamesDisconnected() {
    return this.database.collection(GAMES_COLLECTION).update(
      { connected: true }, { $set: { connected: false } }
    )
  }

  findGame(gameId) {
    return this.database.collection(GAMES_COLLECTION)
      .find({ gameId }).project(GAME_PROJECTION).limit(1).next()
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

  async findSocketId(gameId) {
    return (
      await this.database
        .collection(GAMES_COLLECTION)
        .find({ gameId })
        .project({ socketId: 1, _id: 0 })
        .limit(1)
        .next()
    ).socketId
  }
}
