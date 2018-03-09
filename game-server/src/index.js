const uuid = require("uuid/v4")
const io = require("socket.io")(3000)

const MongoClient = require("mongodb").MongoClient

const mongoURL = `${process.env.MONGODB_URI}:27017`

const dbName = "test"

let db

MongoClient
  .connect(mongoURL)
  .then(client => {
    console.log("connected to mongoDB")
    db = client.db(dbName)
  })
  .catch(err => {
    console.error(err)
  })


io.on("connect", socket => {
  console.log(`client ${socket.id} connected.`)

  socket.on("newGame", (name, avatar, toSocket) => {

    const id = uuid()

    console.log(`client ${socket.id} requested a new Game with name: ${name} and avatar: ${avatar}`)

    db.collection("games").insertOne({ id, name, avatar }).then(result => {
      console.log(result.insertedCount)
    })

    toSocket(id)
  })

  socket.on("resumeGame", (gameId, toSocket) => {
    requestGameInfo(gameId).then(
      gameInfo => toSocket(gameInfo)
    )
  })
})

async function requestGameInfo(id) {
  const gameInfo = await db.collection("games").find({ id }).limit(1).next()
  return gameInfo
}
