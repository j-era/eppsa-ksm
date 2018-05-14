import React from "react"
import { TransitionGroup } from "react-transition-group"
import styled from "styled-components"

import Fade from "./fade"

const Container = styled.div`
  position: relative;
  flex-grow: 1;
`

const Station = styled.div`
  position: absolute;
  left: ${props => props.index * props.width}%;
  bottom: 0;
  width: ${props => props.width}%;
  height: 25%;
  background-color: ${props => props.color};
  border-radius: 50%;
  align-self:flex-end;
`

const Avatar = styled.img`
  position: absolute;
  left: ${props =>
    props.stationIndex * props.stationWidth +
    (props.stationWidth / (props.numAvatarsAtStation + 1) *
    (props.index + 1) - props.stationWidth / 2)}%;
  width: ${props => props.stationWidth}%;
  z-index: ${props => props.index};
  transition: left 1s ease;
`

export default function GameBoard({ assetServerUri, connectedGames, content }) {
  const numChallenges = Object.keys(content.challenges).length
  const stationWidth = 100 / numChallenges
  const games = connectedGames.filter(({ challengeNumber }) => challengeNumber <= numChallenges)

  return (
    <Container>
      { renderStations(content.challenges, stationWidth) }
      <TransitionGroup>
        { renderGames(connectedGames, content.avatars, stationWidth, assetServerUri) }
      </TransitionGroup>
    </Container>
  )
}

function renderStations(challenges, stationWidth) {
  const stations = Object.keys(challenges)
  return stations.map((index) =>
    <Station
      key={ index }
      index={ Number(index) - 1 }
      width={ stationWidth }
      color={ challenges[index].color } />
  )
}

function renderGames(connectedGames, avatars, stationWidth, assetServerUri) {
  const gameLists = []
  connectedGames.forEach((game) => {
    if (!gameLists[game.challengeNumber]) {
      gameLists[game.challengeNumber] = []
    }

    gameLists[game.challengeNumber].unshift(game.gameId)
  })

  return connectedGames.map(({ avatar, challengeNumber, gameId }) =>
    <Fade key={ gameId }>
      <Avatar
        index={ gameLists[challengeNumber].indexOf(gameId) }
        stationIndex={ challengeNumber - 1 }
        stationWidth={ stationWidth }
        numAvatarsAtStation={ gameLists[challengeNumber].length }
        src={ `${assetServerUri}/${avatars[avatar].small.src}` } />
    </Fade>
  )
}
