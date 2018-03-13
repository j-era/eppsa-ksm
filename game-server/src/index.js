const uuid = require("uuid/v4")
const io = require("socket.io")(3000)
const MongoClient = require("mongodb").MongoClient

const MONGODB_URI = `${process.env.MONGODB_URI}:27017`
const DATABASE_NAME = "EPPSA_KSM"

let database

MongoClient.connect(MONGODB_URI).then((client) => {
  console.log("Connected to mongodb")
  database = client.db(DATABASE_NAME)

  io.on("connect", socket => {
    console.log(`client ${socket.id} connected.`)

    let gameInfo = null

    socket.on("newGame", async (name, avatar, toSocket) => {
      console.log(`client ${socket.id} started a new Game with name: ${name} and avatar: ${avatar}`)

      if (!gameInfo) {
        gameInfo = {
          gameId: uuid(),
          name,
          avatar,
          currentChallenge: 1,
          score: 0,
          startTime: new Date(),
          challenges: []
        }

        await database.collection("games").insertOne(gameInfo)
        toSocket(gameInfo)
      } else {
        toSocket(new Error("gameInfo already exists!"))
      }
    })

    socket.on("resumeGame", async (gameId, toSocket) => {
      gameInfo = await database.collection("games").find({ gameId }).limit(1).next()
      if (!gameInfo) {
        console.log(`Error: Could not find gameInfo for gameId: ${gameId}`)
      }

      toSocket(gameInfo)
    })

    socket.on("startChallenge", () => {
      if (gameInfo) {
        const startTime = new Date()
        const collection = `challenge-${gameInfo.currentChallenge}`
        database.collection(collection).insertOne({ gameId: gameInfo.gameId, startTime })
      }
    })

    socket.on("completeChallenge", (result) => {
      if (gameInfo) {
        const collection = `challenge-${gameInfo.currentChallenge}`
        const filter = { gameId: gameInfo.gameId, $sort: { startTime: -1 } }
        const challenge = Object.assign({ endTime: new Date() }, result)
        database.collection(collection).updateOne(filter, { $set: challenge })

        gameInfo.score += result.score
        gameInfo.currentChallenge++

        updateGameInfo(gameInfo)
      }
    })
  })

  function updateGameInfo(gameInfo) {
    return database.collection("games").updateOne({ gameId: gameInfo.gameId }, { $set: gameInfo })
  }

  function insertChallenge(number, result) {
  }
}).catch((error) => console.error(error))
