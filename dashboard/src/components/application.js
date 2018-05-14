import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import GameScores from "./gameScores"
import Header from "./header"

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

function Application(props) {
  const {
    assetServerUri,
    connectedGames,
    content,
    scoreMode,
    highscoreGames,
    recentFinishedGames
  } = props

  return (
    <Container>
      <Header
        assetServerUri={ assetServerUri }
        content={ content }
        connectedGames={ connectedGames } />
      <GameScores
        assetServerUri={ assetServerUri }
        content={ content }
        highscoreGames={ highscoreGames }
        recentFinishedGames={ recentFinishedGames }
        scoreMode={ scoreMode } />
    </Container>
  )
}

export default connect(
  (state) => state
)(Application)
