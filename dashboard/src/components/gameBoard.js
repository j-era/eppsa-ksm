import React from "react"

export default function GameBoard({ connectedGames, content }) {
  return (
    <div style={ { height: "50px" } }>
      { renderGames(connectedGames, content.challenges) }
      { renderStations(Object.keys(content.challenges).length) }
    </div>
  )
}

function renderGames(connectedGames, challenges) {
  const stepPercent = 100 / Object.keys(challenges).length

  return (
    <div style={ { height: "25px" } }>
      { connectedGames.map((game) => renderGame(game, stepPercent)) }
    </div>
  )
}

function renderGame(game, stepPercent) {
  return (
    <div
      key={ game.gameId }
      style={ { position: "absolute", left: `${(game.challengeNumber - 1) * stepPercent}%` } }>
      { game.name }
    </div>
  )
}

function renderStations(numChallenges) {
  const stepPercent = 100 / numChallenges

  const stations = []
  for (let i = 1; i <= numChallenges; i++) {
    stations.push(i)
  }

  return (
    <div style={ { height: "25px" } }>
      { stations.map((station) => renderStation(station, stepPercent)) }
    </div>
  )
}

function renderStation(station, stepPercent) {
  return (
    <div
      key={ station }
      style={ { position: "absolute", left: `${(station - 1) * stepPercent}%` } }>
      { station }
    </div>
  )
}
