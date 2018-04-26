import React from "react"
import { connect } from "react-redux"
import styled, { ThemeProvider, withTheme } from "styled-components"
import cloneDeep from "lodash.clonedeep"

import Card from "./card"
import { default as Background } from "./background"
import Header from "./header"
import pages from "./pages"

const Container = styled.div`
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
`


function Application(props) {
  const { content, gameState, winWidth, winHeight } = props
  const { render, showHeader } = getPageData(props)
  const challenge = props.content.challenges[props.challengeNumber]

  return (
    <ThemeProvider
      theme={ (theme) => updateTheme(theme, winWidth, winHeight, challenge, showHeader) }>
      <Container>
        { showHeader && <Header props={ props } /> }
        <Background
          bannerText={ content.name }
          inGameSetup={ inGameSetup(gameState) } >
          <Card>
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

function updateTheme(theme, winWidth, winHeight, challenge, showHeader) {
  const [cardWidth, cardHeight] = calculateCardSize(winWidth, winHeight, showHeader)
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
  newTheme.layout.cardPadding *= cardWidthRatio
  newTheme.layout.cardWidth = cardWidth
  newTheme.layout.cardHeight = cardHeight
  return newTheme
}

function calculateCardSize(winWidth, winHeight, showHeader) {
  const innerHeight = showHeader ? winHeight * 0.9 : winHeight
  const winRatio = winWidth / innerHeight
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
