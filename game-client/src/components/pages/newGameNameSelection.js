import React from "react"

import { updateName, startNewGame } from "../../actionCreators"

export default function NewGameNameSelection(props) {
  const { assetServerUri, avatar, content, dispatch, gameServer, name, maxChallenges } = props

  return (
    <div>
      <img src={ `${assetServerUri}/${content.avatars[avatar].icon.src}` } />
      <input
        type="text"
        value={ name }
        onChange={ event => dispatch(updateName(event.target.value)) } />
      <button onClick={ () => dispatch(startNewGame(name, avatar, maxChallenges, gameServer)) }>
        Bestätigen
      </button>
    </div>
  )
}
