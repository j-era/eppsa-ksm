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
  height: 100%;
`

const Header = styled.div`
  height: ${100 - appRatio}%;
`

const Background = styled(BackgroundComponent)`
  height: ${appRatio}%;
`

const innerRatio = window.innerWidth / window.innerHeight

function Application(props) {
  const fillColor = props.content.challenges[props.challengeNumber]
    ? props.content.challenges[props.challengeNumber].color
    : props.theme.colors.secondary  

  const { render, showHeader } = getPageData(props)

  return (
    <Container>
      <Header>
        { showHeader && renderHeader(props) }
      </Header>
      <Background
        bannerText={ props.content.name }
        inGameSetup={ inGameSetup(props.gameState) }
        fillColor={ fillColor } >
        <Card innerRatio={ innerRatio }>
          <Page>
            { React.createElement(render, props) }
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

function getPageData({ showGameManual, gameState }) {
  return showGameManual ? pages.GAME_MANUAL : pages[gameState]
}

export default connect((state) => state)(Application)

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
