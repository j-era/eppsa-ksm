const MongoClient = require("mongodb").MongoClient

const MONGODB_URI = `${process.env.MONGODB_URI}:27017`
const DATABASE_NAME = "EPPSA_KSM"
const GAMES_COLLECTION = "games"

module.exports = class MongoDB {
  contructor() {
    this.logger = logger
  }

  async connect() {
    const client = await MongoClient.connect(MONGODB_URI)
    this.database = client.db(DATABASE_NAME)
  }

  findGame(gameId) {
    return this.database.collection(GAMES_COLLECTION).find({ gameId }).limit(1).next()
  }

  newGame(game) {
    return this.database.collection(GAMES_COLLECTION).insertOne(game)
  }

  updateGame(game) {
    return this.database.collection(GAMES_COLLECTION)
      .updateOne({ gameId: game.gameId }, { $set: game })
  }

  startChallenge(number, challenge) {
    return this.database.collection(`challenge-${number}`).insertOne(challenge)
  }

  async finishChallenge(number, challenge) {
    const filter = await this.database.collection(`challenge-${number}`)
      .find({ gameId: challenge.gameId })
      .sort({ startTime: -1 })
      .limit(1).next()

      this.database.collection(`challenge-${number}`).updateOne(filter, { $set: challenge })
  }
}