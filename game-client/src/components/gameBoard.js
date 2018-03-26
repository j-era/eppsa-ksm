import React from "react"

export default function GameBoard({ activeGames, challengeNumber, maxChallenges }) {
  return (
    <div style={ { height: "50px" } }>
      { renderGames(activeGames, maxChallenges) }
      { renderStations(maxChallenges) }
    </div>
  )
}

function renderGames(activeGames, maxChallenges) {
  const stepPercent = 100 / maxChallenges
  
  return (
    <div style={ { height: "25px" } }>
      { activeGames.map((game) => renderGame(game, stepPercent)) }
    </div>
  )
}

function renderGame(game, stepPercent) {
  return (
    <div style={ { position: "absolute", left: `${(game.challengeNumber - 1) * stepPercent}%` } }>
      { game.name }
    </div>
  )
}

function renderStations(maxChallenges) {
  const stepPercent = 100 / maxChallenges
  
  const stations = []
  for (let i = 1; i <= maxChallenges; i++) {
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
    <div style={ { position: "absolute", left: `${(station - 1) * stepPercent}%` } }>
      { station }
    </div>
  )
}
