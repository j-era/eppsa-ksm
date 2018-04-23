import React from "react"

import { updateAvatar, updateGameState } from "../../actionCreators"
import { NEW_GAME_AVATAR_CONFIRMATION } from "../../gameStates"

export default function NewGameAvatarSelection(props) {
  const { content, dispatch } = props

  return (
    <div>
      <div>{ content.shared.texts.selectAvatar }</div>
      { Object.keys(content.avatars).map(avatar => renderAvatarSelector(avatar, dispatch)) }
      <div>{ content.shared.texts.selectAvatarInstructions }</div>
    </div>
  )
}

function renderAvatarSelector(avatar, dispatch) {
  return (
    <button
      key={ avatar }
      onClick={ () => {
        dispatch(updateAvatar(avatar))
        dispatch(updateGameState(NEW_GAME_AVATAR_CONFIRMATION))
      } }>
      { avatar }
    </button>
  )
}
