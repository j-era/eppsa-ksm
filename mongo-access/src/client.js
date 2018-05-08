const socket = require("socket.io-client")("https://mongo.marco.eppsa.de")

socket.on("connect", () => {
  console.log("connected as " + socket.id)

  const querry = {
    collection: "challenge-1",
    filter: { gameId: "94650c20-eccb-419d-a788-19827678ac29" },
    limit: 0
  }

  socket.emit("request", querry, response => {
    console.log(response)
    console.log(response.length)
  })
})
