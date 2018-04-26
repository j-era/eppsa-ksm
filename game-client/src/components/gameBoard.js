import React from "react"
import styled from "styled-components"
import { getCookie } from "../cookie"

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

    if (station.length < 3 || game.gameId === getCookie("gameId")) {
      station.push(game)
    }

    if (station.length > 3) {
      station.shift()
    }
  })

  const Board = styled.div`
    height: 100%;
    width: 220vw;
    
    display: flex;
    
    flex-direction: row;
    
    ${() => {
    if (resumableGame) {
      return `transform: translate(${40 - 20 * (challengeNumber - 1)}vw);`
    }
  }}}
  `

  const Area = styled.div`
    position: relative;
    height: 97.5%;
    width: 17.5vw;
    margin-left: 1.25vw;
    margin-right: 1.25vw;
  `

  const Field = styled.div`
    position: absolute;
    bottom: 35%;
    z-index: -1;
    background-color: ${props => props.fill};
    width: 100%;
    height: 15%;
    border-radius: 50%;
  `

  const Avatars = styled.div`
    position: absolute;
    left: 0%;
    bottom: 30%;
    width: 100%;
    
    display: flex;
    flex-direction: row;
    justify-content: ${props => props.count > 2 ? "center" : "start"};
  `

  const OwnAvatar = styled.div`
    position: absolute;
    left: 0%;
    bottom: 10%;
    width: 100%;
    
    display: flex;
    flex-direction: row;
    justify-content: center;
  `

  const avatarWith = 13

  const Avatar = styled.img`
    margin-left: -20%;
    margin-right: -20%;
    width: ${avatarWith}vw;
    height: ${avatarWith * 1.111111}vw;
  `

  const Self = styled.img`
    width: ${avatarWith}vw;
    height: ${avatarWith * 1.111111}vw;
  `

  return (
    <Board>
      {
        stations.map((station, index) =>
          <Area key={ index.toString() }>
            <Field fill={ content.challenges[index + 1].color }>
              <Avatars count={ station.length }>
                {
                  station.map((game, gameIndex, array) => game.gameId === getCookie("gameId") ?
                    null
                    :
                    <Avatar
                      offset={ index.toString() }
                      gameIndex={ gameIndex }
                      array={ array }
                      key={ game.gameId }
                      src={ `${assetServerUri}/${content.avatars[game.avatar].small.src}` } />
                  )
                }
              </Avatars>
              <OwnAvatar>
                {
                  station.map((game) => game.gameId === getCookie("gameId") ?
                    <Self
                      key={ game.gameId }
                      src={ `${assetServerUri}/${content.avatars[game.avatar].small.src}` } />
                    :
                    null
                  )
                }
              </OwnAvatar>
            </Field>
          </Area>
        )
      }
    </Board>
  )
}
