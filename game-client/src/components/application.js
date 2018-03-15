import React from "react"
import { connect } from "react-redux"

import Game from "./game"
import StartDialog from "./startDialog"

function Application(props) {
    return (
      <div>
        <div>{ props.content.description }</div>
        { props.gameStarted ?
          <Game/> :
          <StartDialog
            previousGameInfo={ props.previousGameInfo }
            name={ props.name }
            avatars={ props.content.avatars }
            avatar={ props.avatar }
            assetServerUri={ props.assetServerUri }
            onResumeGame={ props.onResumeGame }
            onStartNewGame={ props.onStartNewGame }
            onUpdateName={ props.onUpdateName }
        /> }
      </div>
    )
}

export default connect(
  (state) => state
)(Application)
