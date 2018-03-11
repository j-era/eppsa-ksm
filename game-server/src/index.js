const uuid = require("uuid/v4")
const io = require("socket.io")(3000)

const MongoClient = require("mongodb").MongoClient

const mongoURL = `${process.env.MONGODB_URI}:27017`

console.log(mongoURL)

const dbName = "test"

let db

init().then(() => {
  for (let i = 0; i <= 20; i++) {
    testDB(uuid()).then(result => {
      console.log(result)
    })
  }
})

async function init() {
  try {
    const client = await MongoClient.connect(mongoURL)
    console.log("connected to MongoDB")
    db = client.db(dbName)
  } catch (error) {
    console.error(error)
  }
  setupSocketIo()
}

function setupSocketIo() {
  io.on("connect", socket => {
    console.log(`client ${socket.id} connected.`)

    socket.on("newGame", (name, avatar, toSocket) => {
      const gameId = uuid()

      console.log(`client ${socket.id} started a new Game with name: ${name} and avatar: ${avatar}`)

      storeGameInfo({ gameId, name, avatar }).then(() => {
        toSocket(gameId)
      })
    })

    socket.on("resumeGame", (gameId, toSocket) => {
      requestGameInfo(gameId).then(
        gameInfo => toSocket(gameInfo)
      )
    })
  })
}

async function storeGameInfo(gameInfo) {
  await db.collection("games").insertOne(gameInfo)
}

async function requestGameInfo(gameId) {
  return await db.collection("games").find({ gameId }).limit(1).next()
}

async function testDB(gameId) {
  await storeGameInfo({ gameId, name: "foo", avatar: 1 })
  return await requestGameInfo(gameId)
}
