const io = require("socket.io")

const MongoDB = require("./mongoDB")

const MONGODB_URI = `${process.env.MONGODB_URI}:27017`
const DATABASE_NAME = "EPPSA_KSM"

const database = new MongoDB(MONGODB_URI, DATABASE_NAME)

database.connect().then(() => {
  const server = io(3000)

  server.on("connect", socket => {
    console.log(`client ${socket.id} connected`)
    socket.on("request", async (request, response) => {
      const result = await database.querry(request)
      response(result)
    })
  })
})

