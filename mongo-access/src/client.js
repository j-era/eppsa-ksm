const socket = require("socket.io-client")("https://mongo.marco.eppsa.de")

socket.on("connect", () => {
  console.log("connected as " + socket.id)

  const querry = {
    collection: "games",
    filter: { },
    limit: 0
  }

  socket.emit("request", querry, response => {
    console.log(response)
    console.log(response.length)
  })
})
