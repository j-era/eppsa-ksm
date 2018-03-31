import React from "react"

export default function HighscoreGames({ highscoreGames }) {
  return (
    <div>
      { highscoreGames.forEach(renderGame) }
    </div>
  )
}

function renderGame({ avatar, gameId, name, score }) {
  return (
    <div key={ gameId }>
      { `${score} ${name} ${avatar}` }
    </div>
  )
}
