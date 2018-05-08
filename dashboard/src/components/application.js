import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import Header from "./header"
import RecentFinishedGames from "./recentFinishedGames"
import HighscoreGames from "./highscoreGames"
import * as scoreModes from "../scoreModes"

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Background = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  background-image: url(${props => props.image});
  background-repeat: no-repeat;
  background-size: contain;
  background-position-y: bottom;
`

function Application(props) {
  return (
    <Container>
      <Header
        assetServerUri={ props.assetServerUri }
        content={ props.content }
        connectedGames={ props.connectedGames } />
      <Background
        image={ `${props.assetServerUri}/${props.content.shared.assets.dashboardMap.src}` }>
        {
          props.scoreMode === scoreModes.ALL_TIME_HIGHSCORE ?
            <HighscoreGames
              content={ props.content }
              highscoreGames={ props.highscoreGames } /> :
            <RecentFinishedGames
              content={ props.content }
              recentFinishedGames={ props.recentFinishedGames } />
        }
      </Background>
    </Container>
  )
}

export default connect(
  (state) => state
)(Application)
