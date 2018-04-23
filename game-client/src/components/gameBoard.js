import React from "react"
import styled from "styled-components"

export default function GameBoard({ connectedGames, maxChallenges }) {
  const stations = []

  // fill stations
  for (let i = 0; i < maxChallenges; i++) {
    stations[i] = []
  }

  // sort games into stations
  connectedGames.forEach(game => {
    stations[game.challengeNumber - 1].push(game)
  })


  const Board = styled.div`
    height: 100%;
    width: 220vw;
    
    overflow: scroll;
    
    display: flex;
    
    flex-direction: row;
  `

  const Station = styled.div`
    width: 17.5vw;
    margin-left: 1.25vw;
    margin-right: 1.25vw;
  `


  const Game = styled.div`
    
  `

  return (
    <Board>
      {
        stations.map((station, index) =>
          <Station key={ index.toString() }>
            {
              station.map(game =>
                <Game key={ game.gameId }>
                  { game.name }
                </Game>
              )
            }
            { index.toString() }
          </Station>
        )
      }
    </Board>
  )
}

