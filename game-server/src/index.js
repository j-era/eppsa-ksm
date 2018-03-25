const bunyan = require("bunyan")
const io = require("socket.io")(3000, { pingInterval: 5000, pingTimeout: 2000 });

const Client = require("./client")
const MongoDB = require("./api/mongodb")

const LOG = bunyan.createLogger({name: "game-server"});

const mongoDB = new MongoDB()

mongoDB.connect().then(() => {
  LOG.info("Connected to MongoDB")

  io.on("connect", socket => {
    const client = new Client(socket, mongoDB, LOG)
    client.subscribe()
  })

  // forward database update event to all clients
  mongoDB.on("update", () => {
    io.emit("update")
  })
}).catch((error) => LOG.error(error))
