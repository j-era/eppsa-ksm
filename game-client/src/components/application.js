import React from "react"
import { connect } from "react-redux"
import styled, { ThemeProvider } from "styled-components"
import cloneDeep from "lodash.clonedeep"

import Card from "./card"
import GameBoard from "./gameBoard"
import GameManualButton from "./gameManualButton"
import { default as Background } from "./background"
import pages from "./pages"

const Container = styled.div`
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  height: 10%;
`

function Application(props) {
  const { content, gameState } = props
  const { render, showHeader } = getPageData(props)
  const challenge = props.content.challenges[props.challengeNumber]

  return (
    <ThemeProvider
      theme={ (theme) => updateTheme(theme, challenge) }>
      <Container>
        { showHeader && renderHeader(props) }
        <Background
          bannerText={ content.name }
          inGameSetup={ inGameSetup(gameState) } >
          <Card ratio={ showHeader ? 0.9 : 1 }>
            { React.createElement(render, props) }
          </Card>
        </Background>
      </Container>
    </ThemeProvider>
  )
}

function getPageData({ showGameManual, gameState }) {
  return showGameManual ? pages.GAME_MANUAL : pages[gameState]
}

function updateTheme(theme, challenge) {
  const newTheme = cloneDeep(theme)
  newTheme.colors.area = challenge ? challenge.color : theme.colors.secondary
  return newTheme
}

function renderHeader(props) {
  return (
    <Header>
      { !props.showGameManual && <GameManualButton { ...props } /> }
      <GameBoard { ...props } />
    </Header>
  )
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

export default connect((state) => state)(Application)
