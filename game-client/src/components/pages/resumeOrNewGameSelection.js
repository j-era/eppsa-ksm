import React from "react"

import { configureNewGame, resumeGame } from "../../actionCreators"

export default function ResumeOrNewGameSelection(props) {
  const { assetServerUri, content, resumableGame, dispatch, gameServer } = props

  return (
    <div>
      <img src={ `${assetServerUri}/${content.avatars[resumableGame.avatar].icon.src}` } />
      <div>{ resumableGame.name }</div>
      <button onClick={ () => dispatch(resumeGame(resumableGame.gameId, gameServer)) }>
        Resume
      </button>
      <button onClick={ () => dispatch(configureNewGame()) }>
        Start New Game
      </button>
    </div>
  )
}
