const bunyan = require("bunyan")
const io = require("socket.io")

const Client = require("./client")
const MongoDB = require("./api/mongoDB")

const CONNECTION_CONFIG = { pingInterval: 5000, pingTimeout: 2000 }
const LOG = bunyan.createLogger({ name: "game-server" })

const mongoDB = new MongoDB(LOG)
mongoDB.connect().then(async () => {
  LOG.info("Connected to MongoDB")

  await mongoDB.ensureAllGamesDisconnected()

  const server = io(3000, CONNECTION_CONFIG)
  server.on("connect", socket => {
    const client = new Client(socket, mongoDB, LOG)
    client.subscribe()

    socket.on("joinRoom", room => {
      socket.join(room, (error) => {
        if (error) {
          LOG.error({ socketId: socket.id, room }, "Could not join room")
        } else {
          emitClientsInRoom(server, room)
          socket.on("disconnect", () => emitClientsInRoom(server, room))
          LOG.info({ socketId: socket.id, room }, "Client joined room")
        }
      })
    })
  })

  // forward database update event to all clients
  mongoDB.on("connectedGames", (connectedGames) =>
    server.emit("connectedGames", connectedGames)
  )
  mongoDB.on("recentFinishedGames", (recentFinishedGames) =>
    server.emit("recentFinishedGames", recentFinishedGames)
  )
  mongoDB.on("highscoreGames", (highscoreGames) =>
    server.emit("highscoreGames", highscoreGames)
  )
}).catch((error) => LOG.error(error))

function emitClientsInRoom(server, room) {
  const roomObj = server.nsps["/"].adapter.rooms[room]
  if (roomObj) {
    server.to(room).emit("clientsInRoom", Object.keys(roomObj.sockets))
  }
}
