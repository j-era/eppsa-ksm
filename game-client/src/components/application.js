import React from "react"
import { connect } from "react-redux"
import styled, { css, ThemeProvider } from "styled-components"
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

const ScoreContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Score = styled.div`
  margin-top: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.font.button.size}vw;
  background-color: ${props => props.theme.colors.area};
  color: white;
  padding-left: 1em;
  padding-right: 1em;
  height: 1.2em;
  border-radius: ${props => props.theme.layout.borderRadius};
  ${props => props.visible
    ? css`
      transform: scale(1, 1);
      opacity: 1;
      transition:
        transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2) 500ms,
        opacity  150ms ease 500ms;
    `
    : css`
      transform: scale(0, 0);
      opacity: 0;
      transition:
        transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2),
        opacity  150ms ease;
    `}
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
        {
          <ScoreContainer>
            <Score visible={ props.showScore }>
              { props.challengeScore }
            </Score>
          </ScoreContainer>
        }
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
