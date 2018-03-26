import React from "react"

export default function GameBoard({ activeGames, challengeNumber, maxChallenges }) {
  return (
    <div style={ { height: "50px" } }>
      { renderGames(activeGames, maxChallenges) }
    </div>
  )
}

function renderGames(activeGames, maxChallenges) {
  const stepPercent = 100 / maxChallenges
  
  return (
    <div>
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
