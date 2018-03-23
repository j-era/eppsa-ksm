const bunyan = require("bunyan")
const uuid = require("uuid/v4")
const io = require("socket.io")(3000)
const MongoClient = require("mongodb").MongoClient

const MONGODB_URI = `${process.env.MONGODB_URI}:27017`
const DATABASE_NAME = "EPPSA_KSM"

const LOG = bunyan.createLogger({name: "game-server"});

let database

MongoClient.connect(MONGODB_URI).then((client) => {
  LOG.info({ MONGODB_URI }, "Connected to mongodb")

  database = client.db(DATABASE_NAME)

  io.on("connect", socket => {
    LOG.info({ socketId: socket.id }, "Client connected")

    socket.on("findGame", async (gameId, toSocket) => {
      LOG.info({ socketId: socket.id, gameId }, "Finding game")

      toSocket(await findGame(gameId))
    })

    socket.on("newGame", async (name, avatar, maxChallenges, toSocket) => {
      LOG.info({ socketId: socket.id, playerName: name, avatar, maxChallenges }, "Starting a new game")

      const game = {
          gameId: uuid(),
          finished: false,
          name,
          avatar,
          score: 0,
          challenge: 1,
          maxChallenges,
          startTime: new Date()
        }

      database.collection("games").insertOne(game)
      toSocket(game)
    })

    socket.on("resumeGame", async (gameId, maxChallenges, toSocket) => {
      LOG.info({ socketId: socket.id, gameId, maxChallenges }, "Resuming game")

      const game = await findGame(gameId)
      if (game) {
        game.maxChallenges = maxChallenges
        handleGameFinished(game)
        updateGame(game)
      } else {
        LOG.error({ gameId }, "Could not find game in database")
      }

      toSocket(game)
    })

    socket.on("startChallenge", async (gameId) => {
      LOG.info({ socketId: socket.id, gameId }, "Starting challenge")

      const game = await findGame(gameId)
      if (game) {
        const startTime = new Date()
        database.collection(`challenge-${game.challenge}`).insertOne({ gameId, startTime })
      } else {
        LOG.error({ gameId }, "Could not find game in database")
      }
    })

    socket.on("finishChallenge", async (gameId, result, toSocket) => {
      LOG.info({ socketId: socket.id, gameId, result }, "Finish challenge")

      const game = await findGame(gameId)
      if (game) {
        const collection = `challenge-${game.challenge}`
        const filter = await database.collection(collection)
          .find({ gameId: game.gameId })
          .sort({ startTime: -1 })
          .limit(1).next()

        const challenge = { finishTime: new Date(), ...result }
        database.collection(collection).updateOne(filter, { $set: challenge })

        game.score += result.score
        game.challenge++

        handleGameFinished(game)
        updateGame(game)
      } else {
        LOG.error({ gameId }, "Could not find game in database")
      }

      toSocket(game)
    })
  })

  function findGame(gameId) {
    return database.collection("games").find({ gameId }).limit(1).next()
  }

  function updateGame(game) {
    return database.collection("games").updateOne({ gameId: game.gameId }, { $set: game })
  }

  function handleGameFinished(game) {
    if (!game.finished && game.challenge > game.maxChallenges) {
      game.finished = true
      game.finishedTime = new Date()
      LOG.info("Game finished")
    }
  }
}).catch((error) => LOG.error(error))
