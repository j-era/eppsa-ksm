import React from "react"

import { updateGameState } from "../../actionCreators"
import { NEW_GAME_AVATAR_SELECTION, NEW_GAME_NAME_SELECTION } from "../../gameStates"

export default function NewGameAvatarConfirmation(props) {
  const { assetServerUri, avatar, content, dispatch } = props

  return (
    <div>
      <img src={ `${assetServerUri}/${content.avatars[avatar].icon.src}` } />
      <button onClick={ () => dispatch(updateGameState(NEW_GAME_NAME_SELECTION)) }>
        Zum Spielernamen
      </button>
      <button onClick={ () => dispatch(updateGameState(NEW_GAME_AVATAR_SELECTION)) }>
        Zurück
      </button>
    </div>
  )
}
