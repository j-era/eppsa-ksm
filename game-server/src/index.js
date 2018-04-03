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
  
  const server = io(3000, CONNECTION_CONFIG)
  server.on("connect", socket => {
    const client = new Client(socket, mongoDB, LOG)
    client.subscribe()
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
