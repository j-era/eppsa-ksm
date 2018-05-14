const socket = require("socket.io-client")("https://mongo.marco.eppsa.de")

socket.on("connect", () => {
  console.log(`connected as ${socket.id}`)

  const range = {
    from: "2018-03-01T00:00:00.000Z",
    to: "2018-05-30T00:00:00.000Z"
  }

  socket.emit("startedGamesInRange", range, response => {
    console.log(`started games: ${response.length}`)
  })

  socket.emit("finishedGamesInRange", range, response => {
    console.log(`finished games: ${response.length}`)
  })

  for (let i = 0; i < 11; i ++) {
    const challengeNumber = i + 1
    socket.emit("startedChallengesInRange", range, challengeNumber, response => {
      console.log(`challenge ${challengeNumber} has ${response.length} started challenges.`)
    })
    socket.emit("finishedChallengesInRange", range, challengeNumber, response => {
      console.log(`challenge ${challengeNumber} has ${response.length} finished challenges.`)
    })
  }
})
