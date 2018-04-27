import React from "react"
import styled, { css } from "styled-components"
import { getCookie } from "../cookie"

export default function GameBoard(props) {
  const {
    avatar,
    connectedGames,
    maxChallenges,
    challengeNumber,
    assetServerUri,
    content
  } = props

  const stations = []
  let ownGame

  // fill stations
  for (let i = 0; i < maxChallenges; i++) {
    stations[i] = []
  }

  // sort games into stations
  connectedGames.forEach(game => {
    const station = stations[game.challengeNumber - 1]

    if (game.gameId === getCookie("gameId")) {
      ownGame = game
    }

    if (station.length < 3 || game.gameId === getCookie("gameId")) {
      station.push(game)
    }

    if (station.length > 3) {
      station.shift()
    }
  })

  const Board = styled.div`
    height: 100%;
    width: ${(maxChallenges + 1) * 20}%;

    display: flex;

    transform: translate(${40 - 20 * challengeNumber}vw);
  `

  const Area = styled.div`
    display: flex;

    align-items: flex-end;

    position: relative;
    width: 20%;

    padding-bottom: 1%;
  `

  const Field = styled.div`
    position: relative;

    z-index: -1;

    background-color: ${props => props.color};

    width: 100%;
    padding-bottom: 35%;

    border-radius: 50%;

    margin-left: 1.25vw;
    margin-right: 1.25vw;
  `

  const Avatar = styled.div`
    position: absolute;
    bottom: 10%;
    width: 100%;

    display: flex;
    flex-direction: row;
  `

  const MyAvatarContainer = styled(Avatar)`
    justify-content: center;
  `

  const OtherAvatarsContainer = styled(Avatar)`
    ${props => positionAvatars(props)}
  `

  function positionAvatars(props) {
    if (props.isSelfOnField) {
      if (props.count === 2) {
        return css`
          justify-content: start;
          bottom: 25%;
        `
      } else if (props.count === 3) {
        return css`
          justify-content: space-between;
          bottom: 25%;
        `
      }
    } else {
      return css`
        justify-content: center;
        bottom: 10%;
      `
    }
  }

  const avatarWith = 13

  const AvatarImage = styled.div`
    background: url(${props => props.src});
    background-size: contain;
    background-repeat: no-repeat;

    margin-left: -20%;
    margin-right: -20%;

    width: ${avatarWith}vw;
    height: ${avatarWith}vw;
  `

  const MyAvatarImage = styled.div`
    background: url(${props => props.src});
    background-size: contain;
    background-repeat: no-repeat;

    width: ${avatarWith}vw;
    height: ${avatarWith}vw;

    transform-origin: bottom;
    transform: scale(1.2);
  `

  return (
    <Board>
      <Area>
        <Field color={ props.theme.colors.secondary }>
          { challengeNumber === 0 && renderMyAvatar() }
        </Field>
      </Area>
      {
        stations.map((station, index) =>
          <Area key={ index.toString() }>
            <Field color={ content.challenges[index + 1].color }>
              { renderOtherAvatars(station) }
              { station.includes(ownGame) && renderMyAvatar() }
            </Field>
          </Area>
        )
      }
    </Board>
  )

  function renderOtherAvatars(station) {
    return (
      <OtherAvatarsContainer count={ station.length } isSelfOnField={ station.includes(ownGame) }>
        {
          station.filter((game) => game.gameId !== getCookie("gameId")).map((game) =>
            <AvatarImage
              key={ game.gameId }
              src={ `${assetServerUri}/${content.avatars[game.avatar].small.src}` } />
          )
        }
      </OtherAvatarsContainer>
    )
  }

  function renderMyAvatar() {
    return (
      <MyAvatarContainer>
        <MyAvatarImage src={ `${assetServerUri}/${content.avatars[avatar].small.src}` } />
      </MyAvatarContainer>
    )
  }
}
