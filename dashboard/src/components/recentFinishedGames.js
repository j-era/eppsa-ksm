import React from "react"

export default function RecentFinishedGames({ recentFinishedGames }) {
  return (
    <div>
      { recentFinishedGames.forEach(renderGame) }
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
