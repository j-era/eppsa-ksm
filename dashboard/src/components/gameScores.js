import React from "react"
import { TransitionGroup } from "react-transition-group"
import styled from "styled-components"

import Fade from "./fade"
import { ALL_TIME_HIGHSCORE } from "../scoreModes"

const SCORE_POSITIONS = [
  [52, 30],
  [22, 33],
  [73, 36],
  [45, 64],
  [37, 44],
  [3, 50],
  [72, 69],
  [86, 62],
  [19, 66],
  [61, 55]
]

const Container = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  font-size: ${props => props.theme.font.dashboard.name.size}vw;
  font-weight: ${props => props.theme.font.dashboard.name.weight};
  color: ${props => props.theme.font.dashboard.name.color};
  background-image: url(${props => props.image});
  background-repeat: no-repeat;
  background-size: contain;
  background-position-y: bottom;
`

const Label = styled(Fade)`
  position: absolute;
  bottom: 2%;
  left: 42%;
  width: 16%;
  padding: 0.2em 0em;
  border-radius: 50px;
  font-size: ${props => props.theme.font.dashboard.label.size}vw;
  font-weight: ${props => props.theme.font.dashboard.label.weight};
  color: ${props => props.theme.font.dashboard.label.color};
  background-color: white;
  text-align: center;
`

const ScoreContainer = styled(Fade)`
  position: absolute;
  left: ${props => SCORE_POSITIONS[props.index][0]}%;
  top: ${props => SCORE_POSITIONS[props.index][1]}%;
  width: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: move ${props => props.index * 2 + 10}s infinite linear ${props => props.index * 300}ms;

  @keyframes move {
    20% { transform: translate(${props => props.index + 10}%, 5%) };
    40% { transform: translate(${props => props.index}%, 5%) };
    60% { transform: translate(${props => props.index + 10}%, 0%) };
    80% { transform: translate(${props => props.index + 5}%, 5%) };
  }
`

const Score = styled.div`
  width: 100%;
  height: 12%;
  text-align: center;
  font-size: ${props => props.theme.font.dashboard.score.size}vw;
  font-weight: ${props => props.theme.font.dashboard.score.weight};
  color: ${props => props.theme.font.dashboard.score.color};
  padding-bottom: 0.15em;
  background-image: url(${props => props.image});
  background-repeat: no-repeat;
  background-size: contain;
`

const Avatar = styled.img`
  width: 100%;
`

export default function GameScores(props) {
  const { assetServerUri, content, highscoreGames, recentFinishedGames, scoreMode } = props

  const scores = scoreMode === ALL_TIME_HIGHSCORE ? highscoreGames : recentFinishedGames
  const label = scoreMode === ALL_TIME_HIGHSCORE
    ? content.shared.texts.dashboardAllTimeHighscoreLabel
    : content.shared.texts.dashboardRecentFinishedGamesLabel

  return (
    <Container image={ `${assetServerUri}/${content.shared.assets.dashboardMap.src}` }>
      <TransitionGroup>
        <Label key={ label }>{ label }</Label>
        {
          scores.map((game, index) =>
            <ScoreContainer key={ `${scoreMode}_${game.gameId}` } index={ index }>
              { game.name }
              <Score image={ `${assetServerUri}/${content.shared.assets.dashboardWingSign.src}` }>
                { game.score }
              </Score>
              <Avatar src={ `${assetServerUri}/${content.avatars[game.avatar].medium.src}` } />
            </ScoreContainer>
          )
        }
      </TransitionGroup>
    </Container>
  )
}

