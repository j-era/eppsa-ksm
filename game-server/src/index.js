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

    socket.on("newGame", async(name, avatar, toSocket) => {
      console.log(`client ${socket.id} started a new Game with name: ${name} and avatar: ${avatar}`)

      const gameInfo = {
        gameId: uuid(),
        name,
        avatar,
        currentChallenge: 1,
        score: 0,
        startTime: new Date()
      }

      await database.collection("games").insertOne(gameInfo)
      toSocket(gameInfo)
    })

    socket.on("resumeGame", async(gameId, toSocket) => {
      const gameInfo = await database.collection("games").find({ gameId }).limit(1).next()
      if (!gameInfo) {
        console.log(`Error: Could not find gameInfo for gameId: ${gameId}`)
      }

      toSocket(gameInfo)
    })
  })
}).catch((error) => console.error(error))
