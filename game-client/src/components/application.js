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

const CardContent = styled.div`
  width: 100%;
  height: 100%;
  animation: fadein 0.5s;
  @keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }
`

class Application extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { showHeader } = getPageData(nextProps)
    if (showHeader !== prevState.showHeader) {
      clearTimeout(prevState.timeout)
      return { renderCardContent: false, timeout: null }
    }

    return null
  }

  constructor(props) {
    super(props)
    this.state = { renderCardContent: true, timeout: null }
  }

  render() {
    if (!this.state.renderCardContent && !this.state.timeout) {
      setTimeout(() => this.setState({ renderCardContent: true, timeout: null }), 500)
    }

    const { challengeNumber, content, score, showScore } = this.props
    const { render, showHeader } = getPageData(this.props)
    const challenge = content.challenges[challengeNumber]

    return (
      <ThemeProvider
        theme={ (theme) => updateTheme(theme, challenge) }>
        <Container>
          <Header { ...this.props } show={ showHeader } />
          <Score score={ score } show={ showScore } />
          <Background
            { ...this.props }
            bannerText={ content.name } >
            <Card small={ showHeader }>
              { this.state.renderCardContent && 
                <CardContent>{ React.createElement(render, this.props) }</CardContent> }
            </Card>
          </Background>
        </Container>
      </ThemeProvider>
    )
  }
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
