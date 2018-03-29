const bunyan = require("bunyan")

const CONNECTION_CONFIG = { pingInterval: 5000, pingTimeout: 2000 }
const io = require("socket.io")(3000, CONNECTION_CONFIG)

const Client = require("./client")
const MongoDB = require("./api/mongoDB")

const LOG = bunyan.createLogger({ name: "game-server" })

const mongoDB = new MongoDB(LOG)

mongoDB.connect().then(async () => {
  LOG.info("Connected to MongoDB")

  await mongoDB.disconnectGames()

  io.on("connect", socket => {
    const client = new Client(socket, mongoDB, LOG)
    client.subscribe()
  })

  // forward database update event to all clients
  mongoDB.on("connectedGames", (connectedGames) => io.emit("connectedGames", connectedGames))
}).catch((error) => LOG.error(error))
