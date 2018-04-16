import omit from "lodash.omit"
import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import { FINISHED } from "../gameStates"
import GameBoard from "./gameBoard"
import GameManual from "./gameManual"
import GameManualButton from "./gameManualButton"
import pages from "./pages"

import background from "../../node_modules/eppsa-ksm-shared/svg/SVG_Assets_180321_Category_Background.svg"

const Background = styled(background)`
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: scale(1.0);
  fill: grey;
  
`

function Application(props) {
  const pageData = pages[props.gameState]

  const enhancedProps = enhance(props)

  return (
    <div>
      { pageData.showHeader && renderHeader(enhancedProps) }
      <Background viewBox="0 0 1080 3000" />
      { props.showGameManual
        ? <GameManual { ...props } />
        : React.createElement(pageData.render, enhancedProps)
      }
    </div>
  )
}

function renderHeader(props) {
  return (
    <div>
      { !props.showGameManual && <GameManualButton { ...props } /> }
      <GameBoard { ...props } />
    </div>
  )
}

function enhance(props) {
  if (props.gameState === FINISHED) {
    return props
  }

  const challengeTypes = props.content.challenges[props.challengeNumber].challengeTypes
  const challengeType = Object.keys(omit(challengeTypes, "template"))[0]
  const challengeUri = resolveChallengeWebAppUri(challengeType)
  const challengeData = {
    color: props.content.challenges[props.challengeNumber].color,
    challenge: challengeTypes[challengeType],
    shared: props.content.shared,
    staticServerUri: props.staticServerUri
  }

  return Object.assign({ challengeUri, challengeType, challengeData }, props)
}

export default connect((state) => state)(Application)

function resolveChallengeWebAppUri(webApp) {
  const protocol = document.location.protocol
  const environment = document.location.hostname.split(".").slice(1).join(".")
  const challengeUri = new URL(`${protocol}//${webApp}.${environment}`)

  return challengeUri.toString()
}
