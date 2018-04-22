import omit from "lodash.omit"
import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import Card from "./card"
import GameBoard from "./gameBoard"
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
  const enhancedProps = enhance(props)

  const { render, showHeader } = getPageData(enhancedProps)

  return (
    <Container>
      <Header>
        { showHeader && renderHeader(enhancedProps) }
      </Header>
      <Background
        bannerText={ props.content.name }
        inGameSetup={ inGameSetup(props.gameState) }
        fillColor={ enhancedProps.fillColor } >
        <Card innerRatio={ window.innerWidth / window.innerHeight }>
          <Page>
            { React.createElement(render, enhancedProps) }
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
  if (props.content.challenges[props.challengeNumber]) {
    const challengeTypes = props.content.challenges[props.challengeNumber].challengeTypes
    const challengeType = Object.keys(omit(challengeTypes, "template"))[0]
    const challengeUri = resolveChallengeWebAppUri(challengeType)
    const challengeData = {
      color: props.content.challenges[props.challengeNumber].color,
      challenge: challengeTypes[challengeType],
      shared: props.content.shared,
      staticServerUri: props.staticServerUri,
      assetServerUri: props.assetServerUri,
      gameServerUri: props.gameServerUri
    }

    const fillColor = challengeData.color
    return Object.assign({ challengeUri, challengeType, challengeData, fillColor }, props)
  }

  return Object.assign({ fillColor: props.theme.colors.secondary }, props)
}

function getPageData({ showGameManual, gameState }) {
  return showGameManual ? pages.GAME_MANUAL : pages[gameState]
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
