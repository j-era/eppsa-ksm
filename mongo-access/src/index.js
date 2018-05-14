const app = require("express")()
const server = require("http").Server(app)
const io = require("socket.io")(server)

server.listen(3000)

const MongoDB = require("./mongoDB")

const MONGODB_URI = `${process.env.MONGODB_URI}:27017`
const DATABASE_NAME = "EPPSA_KSM"

const database = new MongoDB(MONGODB_URI, DATABASE_NAME)

database.connect().then(() => {
  app.get("/", (req, res) => {
    res.end("hi")
  })

  io.on("connect", socket => {
    console.log(`client ${socket.id} connected`)

    socket.on("request", async (request, response) => {
      const result = await database.querry(request)
      response(result)
    })

    socket.on("startedGamesInRange", async (range, response) => {
      const request = {
        collection: "games",
        find: {
          startTime: {
            $gte: new Date(range.from),
            $lte: new Date(range.to)
          }
        },
        sort: { name: 1 },
        limit: 0
      }

      const result = await database.querry(request)
      response(result)
    })

    socket.on("finishedGamesInRange", async (range, response) => {
      const request = {
        collection: "games",
        find: {
          startTime: {
            $gte: new Date(range.from),
            $lte: new Date(range.to)
          },
          finished: true
        },
        sort: { name: 1 },
        limit: 0
      }

      const result = await database.querry(request)
      response(result)
    })

    socket.on("startedChallengesInRange", async (range, challengeNumber, response) => {
      const request = {
        collection: `challenge-${challengeNumber}`,
        find: {
          startTime: {
            $gte: new Date(range.from),
            $lte: new Date(range.to)
          }
        },
        sort: { name: 1 },
        limit: 0
      }

      const result = await database.querry(request)
      response(result)
    })

    socket.on("finishedChallengesInRange", async (range, challengeNumber, response) => {
      const request = {
        collection: `challenge-${challengeNumber}`,
        find: {
          startTime: {
            $gte: new Date(range.from),
            $lte: new Date(range.to)
          },
          finished: true
        },
        sort: { name: 1 },
        limit: 0
      }

      const result = await database.querry(request)
      response(result)
    })
  })
})
