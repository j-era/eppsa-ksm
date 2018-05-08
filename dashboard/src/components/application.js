import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import Header from "./header"
import RecentFinishedGames from "./recentFinishedGames"
import HighscoreGames from "./highscoreGames"

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

function Application(props) {
  return (
    <Container>
      <Header
        assetServerUri={ props.assetServerUri }
        content={ props.content }
        connectedGames={ props.connectedGames } />
      <RecentFinishedGames
        content={ props.content }
        recentFinishedGames={ props.recentFinishedGames } />
      <HighscoreGames
        content={ props.content }
        highscoreGames={ props.highscoreGames } />
    </Container>
  )
}

export default connect(
  (state) => state
)(Application)
