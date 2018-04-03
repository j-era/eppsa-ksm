import React from "react"

export default function RecentFinishedGames({ recentFinishedGames }) {
  return (
    <div>
      <div>Recent Games</div>
      { recentFinishedGames.map(renderGame) }
    </div>
  )
}

function renderGame({ avatar, gameId, name, score }) {
  return (
    <div key={ gameId }>
      { `${name} ${avatar} ${score}` }
    </div>
  )
}
