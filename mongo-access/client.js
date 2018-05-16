const socket = require("socket.io-client")("https://mongo.marco.eppsa.de")

socket.on("connect", async () => {
  console.log(`connected as ${socket.id}`)

  const range = {
    from: "2018-03-01T00:00:00.000Z",
    to: "2018-05-30T00:00:00.000Z"
  }

  const startedGames = await emitWithRepsonse("startedGamesInRange", range)
  console.log(`started games: ${startedGames.length}`)

  const finishedGames = await emitWithRepsonse("finishedGamesInRange", range)
  console.log(`finished games: ${finishedGames.length}`)

  for (let i = 0; i < 11; i ++) {
    const challengeNumber = i + 1

    const requests = []

    requests.push(emitWithRepsonse("startedChallengesInRange", range, challengeNumber))
    requests.push(emitWithRepsonse("finishedChallengesInRange", range, challengeNumber))

    const results = await Promise.all(requests)

    console.log(`challenge ${challengeNumber} started challenges: ${results[0].length}.`)
    console.log(`challenge ${challengeNumber} finished challenges: ${results[1].length}.`)
  }
})

function emitWithRepsonse(eventName, ...param) {
  return new Promise((resolve) => {
    socket.emit(eventName, ...param, response => {
      resolve(response)
    })
  })
}
