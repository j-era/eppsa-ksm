import React from "react"
import { connect } from "react-redux"

import GameBoard from "./gameBoard"
import RecentFinishedGames from "./recentFinishedGames"
import HighscoreGames from "./highscoreGames"

function Application(props) {
  return (
    <div>
      <GameBoard
        content={ props.content }
        connectedGames={ props.connectedGames } />
      <RecentFinishedGames
        content={ props.content }
        recentFinishedGames={ props.recentFinishedGames } />
      <HighscoreGames
        content={ props.content }
        highscoreGames={ props.highscoreGames } />
    </div>
  )
}

export default connect(
  (state) => state
)(Application)
