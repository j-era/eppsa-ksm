const bunyan = require("bunyan")
const io = require("socket.io")

const Client = require("./client")
const MongoDB = require("./api/mongoDB")

const CONNECTION_CONFIG = { pingInterval: 5000, pingTimeout: 2000 }
const LOG = bunyan.createLogger({ name: "game-server" })

const mongoDB = new MongoDB(LOG)
mongoDB.connect().then(async () => {
  LOG.info("Connected to MongoDB")

  await mongoDB.disconnectGames()
  
  // forward database update event to all clients
  mongoDB.on("connectedGames", (connectedGames) => io.emit("connectedGames", connectedGames))
  
  const server = io(3000, CONNECTION_CONFIG)
  server.on("connect", socket => {
    const client = new Client(socket, mongoDB, LOG)
    client.subscribe()
  })
}).catch((error) => LOG.error(error))
