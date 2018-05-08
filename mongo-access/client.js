const socket = require("socket.io-client")("https://mongo.marco.eppsa.de")

socket.on("connect", () => {
  console.log("connected as " + socket.id)

  const querry = {
    collection: "games",
    find: {
      score: {
        $gte: 400,
        $lt: 5000
      },
      finished: false
    },
    sort: { name: 1 },
    limit: 0
  }

  console.log(querry)

  socket.emit("request", querry, response => {
    console.log(response)

    let score = 0

    response.forEach(game => {
      score += game.score
    })

    console.log(score / response.length)
  })
})
