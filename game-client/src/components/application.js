import omit from "lodash.omit"
import React from "react"
import { connect } from "react-redux"

import Game from "./game"
import StartDialog from "./startDialog"

function Application(props) {

    const maxChallenge = Object.keys(props.content.challenges).length - 1
    const gameDone = props.challenge > maxChallenge

  let challengeTypes = null
  let challengeType = null
  let challengeConfig = null
  let challengeUri = null

  if(!gameDone){
    challengeTypes = props.content.challenges[props.challenge].challengeTypes
    challengeType = Object.keys(omit(challengeTypes, "template"))[0]
    challengeConfig = challengeTypes[challengeType]
    challengeUri = resolveChallengeWebAppUri(challengeType)
  }


    return (
      <div>
        <div>{ props.content.description }</div>
        { gameDone ? <div>Game is Done</div> :
          ( props.gameStarted ?
            <Game
              challenge={ props.challenge }
              challengeUri={ challengeUri }
              challengeConfig={ challengeConfig }
              score={ props.score }
              challengeStarted={ props.challengeStarted }
              onStartChallenge={ props.onStartChallenge }
              onChallengeReady={ props.onChallengeReady }
            /> :
            <StartDialog
              previousGameInfo={ props.previousGameInfo }
              name={ props.name }
              avatars={ props.content.avatars }
              avatar={ props.avatar }
              assetServerUri={ props.assetServerUri }
              onResumeGame={ props.onResumeGame }
              onStartNewGame={ props.onStartNewGame }
              onUpdateName={ props.onUpdateName }
            />
          )
        }
      </div>
    )
}

function resolveChallengeWebAppUri(webApp) {
  const protocol = document.location.protocol
  const environment = document.location.hostname.split(".").slice(1).join(".")
  return `${protocol}//${webApp}.${environment}`
}

export default connect(
  (state) => state
)(Application)
