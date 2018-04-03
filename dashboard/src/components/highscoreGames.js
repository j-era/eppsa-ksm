import React from "react"

export default function HighscoreGames({ highscoreGames }) {
  return (
    <div>
      <div>Highscore</div>
      { highscoreGames.map(renderGame) }
    </div>
  )
}

function renderGame({ avatar, gameId, name, score }, index) {
  return (
    <div key={ gameId }>
      { `${index + 1}. ${score} ${name} ${avatar}` }
    </div>
  )
}
