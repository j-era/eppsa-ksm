import omit from "lodash.omit"
import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import { FINISHED } from "../gameStates"

import Card from "./card"
import GameBoard from "./gameBoard"
import GameManual from "./gameManual"
import GameManualButton from "./gameManualButton"
import pages from "./pages"
import Page from "./page"


const Container = styled.div`
  background-color: ${props => props.theme.colors.secondary};
`

const Background = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: blue;
`

const Header = styled.div`
  height: 20vh;
`

function Application(props) {
  const pageData = pages[props.gameState]

  const enhancedProps = enhance(props)
  const innerHeight = window.innerHeight
  const innerWidth = window.innerWidth
  const innerRatio = innerWidth / innerHeight

  return (
    <Container>
      <Header>
        { pageData.showHeader && renderHeader(enhancedProps) }
      </Header>
      <Background>
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
