import React from "react"
import styled from "styled-components"

export default function GameBoard(
  {
    connectedGames,
    maxChallenges,
    resumableGame,
    challengeNumber,
    assetServerUri,
    content
  }) {
  const stations = []

  // fill stations
  for (let i = 0; i < maxChallenges; i++) {
    stations[i] = []
  }

  // sort games into stations
  connectedGames.forEach(game => {
    const station = stations[game.challengeNumber - 1]

    if (station.length < 3 || game.gameId === resumableGame.gameId) {
      station.push(game)
    }

    if (station.length > 3) {
      station.shift()
    }
  })

  const Board = styled.div`
    height: 100%;
    width: 220vw;
    
    overflow: scroll;
    
    display: flex;
    
    flex-direction: row;
    
    ${() => {
    if (resumableGame) {
      return `transform: translate(${40 - 20 * (challengeNumber - 1)}vw);`
    }
  }}}
  `

  const Area = styled.div`
    height: 97.5%;
    width: 17.5vw;
    margin-left: 1.25vw;
    margin-right: 1.25vw;
  `

  const Avatars = styled.div`
    width: 100%;
    height: 100%;
    
    display: flex;
    
    flex-flow: row nowrap;
    justify-content: center;
  `

  const avatarWith = 13

  const Avatar = styled.img`
    position: relative;
    bottom: 60%;
    
    margin-left: -${props => 100 / (props.count - 2) / 2}%;
    margin-right: -${props => 100 / (props.count - 2) / 2}%;
    
    max-width: ${avatarWith}vw;
    max-height: ${avatarWith * 1.111111111}vw;
    width: auto;
    height: auto;
  `

  const OwnAvatar = styled.img`
    position: absolute;
    bottom: 60%;
    z-index: +1;
    
    max-width: ${avatarWith}vw;
    max-height: ${avatarWith * 1.111111111}vw;
    width: auto;
    height: auto;
  `

  const Field = styled.div`
    position: relative;
    z-index: -1;
    bottom: 60%;
    background-color: #${props => props.fill};
    width: 100%;
    height: 15%;
    border-radius: 50%;
  `

  return (
    <Board>
      {
        stations.map((station, index) =>
          <Area key={ index.toString() }>
            <Avatars>
              {
                station.map(game => game.gameId === resumableGame.gameId ?
                  <OwnAvatar
                    key={ game.gameId }
                    src={ `${assetServerUri}/${content.avatars[game.avatar].icon.src}` } />
                  :
                  <Avatar
                    count={ station.length }
                    key={ game.gameId }
                    src={ `${assetServerUri}/${content.avatars[game.avatar].icon.src}` } />
                )
              }
            </Avatars>
            <Field fill={ content.challenges[index + 1].color } />
          </Area>
        )
      }
    </Board>
  )
}

