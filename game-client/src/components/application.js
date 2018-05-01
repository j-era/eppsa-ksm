import React from "react"
import { connect } from "react-redux"
import styled, { ThemeProvider } from "styled-components"
import cloneDeep from "lodash.clonedeep"

import Card from "./card"
import { default as Background } from "./background"
import Header from "./header"
import pages from "./pages"
import Score from "./score"

const Container = styled.div`
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
`

function Application(props) {
  const { content } = props
  const { render, showHeader } = getPageData(props)
  const challenge = props.content.challenges[props.challengeNumber]

  return (
    <ThemeProvider
      theme={ (theme) => updateTheme(theme, challenge) }>
      <Container>
        { showHeader && <Header props={ props } /> }
        <Score visible={ props.showScore } text={ props.challengeScore } />
        <Background
          { ...props }
          bannerText={ content.name } >
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

export default connect((state) => state)(Application)
