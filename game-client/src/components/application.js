import React from "react"
import { connect } from "react-redux"
import styled, { ThemeProvider, withTheme } from "styled-components"
import cloneDeep from "lodash.clonedeep"

import Card from "./card"
import GameBoard from "./gameBoard"
import GameManualButton from "./gameManualButton"
import { default as Background } from "./background"
import pages from "./pages"
import Page from "./page"

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
  const { render, showHeader } = getPageData(props)
  const challenge = props.content.challenges[props.challengeNumber]

  return (
    <ThemeProvider theme={ (theme) => updateTheme(theme, challenge, showHeader) }>
      <Container>
        { showHeader && renderHeader(props) }
        <Background
          bannerText={ props.content.name }
          inGameSetup={ inGameSetup(props.gameState) } >
          <Card>
            <Page>
              { React.createElement(render, props) }
            </Page>
          </Card>
        </Background>
      </Container>
    </ThemeProvider>
  )
}

function renderHeader(props) {
  return (
    <Header>
      { !props.showGameManual && <GameManualButton { ...props } /> }
      <GameBoard { ...props } />
    </Header>
  )
}

function getPageData({ showGameManual, gameState }) {
  return showGameManual ? pages.GAME_MANUAL : pages[gameState]
}

function updateTheme(theme, challenge, showHeader) {
  const [cardWidth, cardHeight] = calculateCardSize(showHeader)
  const cardWidthRatio = cardWidth / 100

  const newTheme = cloneDeep(theme)
  newTheme.font.headline.size *= cardWidthRatio
  newTheme.font.button.size *= cardWidthRatio
  newTheme.font.text.size *= cardWidthRatio
  newTheme.colors.area = challenge ? challenge.color : theme.colors.secondary
  newTheme.layout.smallSpacing *= cardWidthRatio
  newTheme.layout.mediumSpacing *= cardWidthRatio
  newTheme.layout.largeSpacing *= cardWidthRatio
  newTheme.layout.buttonBorder *= cardWidthRatio
  newTheme.layout.iconBorder *= cardWidthRatio
  newTheme.layout.cardWidth = cardWidth
  newTheme.layout.cardHeight = cardHeight
  return newTheme
}

function calculateCardSize(showHeader) {
  const innerHeight = showHeader ? window.innerHeight * 0.9 : window.innerHeight
  const winRatio = window.innerWidth / innerHeight
  const maxWidth = 98 // maximal relative width
  const maxRatio = 0.46 // maximal expected display ratio (1:2)
  const cardRatio = 2 / 3

  return [(1 + maxRatio - winRatio) * maxWidth, (1 + maxRatio - winRatio) * maxWidth / cardRatio]
}

export default withTheme(connect((state) => state)(Application))

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
