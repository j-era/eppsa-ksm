import omit from "lodash.omit"
import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import { FINISHED } from "../gameStates"

import Card from "./card"
import GameBoard from "./gameBoard"
import GameManual from "./gameManual"
import GameManualButton from "./gameManualButton"
import { default as BackgroundComponent } from "./background"
import pages from "./pages"
import Page from "./page"

const appRatio = 80

const Container = styled.div`
  background-color: white;
`

const Header = styled.div`
  height: ${100 - appRatio}vh;
`

const Background = styled(BackgroundComponent)`
  height: ${appRatio}vh;
`

function Application(props) {
  const pageData = pages[props.gameState]

  const enhancedProps = enhance(props)
  const innerHeight = window.innerHeight
  const innerWidth = window.innerWidth
  const innerRatio = innerWidth / innerHeight

  const fill = inGameSetup(props.gameState) === "true" ?
    props.theme.colors.secondary
    : enhancedProps.challengeData.color

  return (
    <Container>
      <Header>
        { pageData.showHeader && renderHeader(enhancedProps) }
      </Header>
      <Background
        fill={ fill }
        bannerText={ props.content.name }
        inGameSetup={ inGameSetup(props.gameState) }>
        <Card innerRatio={ innerRatio }>
          <Page>
            { props.showGameManual
              ? <GameManual { ...props } />
              : React.createElement(pageData.render, enhancedProps)
            }
          </Page>
        </Card>
      </Background>
    </Container>
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
    staticServerUri: props.staticServerUri,
    assetServerUri: props.assetServerUri,
    gameServerUri: props.gameServerUri,
    room: props.challengeRoom
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

function inGameSetup(gamestate) {
  switch (gamestate) {
    case "NEW_GAME_AVATAR_SELECTION":
      return "true"
    case "NEW_GAME_AVATAR_CONFIRMATION":
      return "true"
    case "NEW_GAME_NAME_SELECTION":
      return "true"
    default:
      return "false"
  }
}
