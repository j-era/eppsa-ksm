import React from "react"
import styled, { keyframes } from "styled-components"

const ScoreContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ScoreElement = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.area};
  font-size: ${props => props.theme.font.button.size}vw;
  text-align: center;
  width: 25%;
  border-radius: ${props => props.theme.layout.borderRadius};
  opacity: 0;
  color: white;

  box-shadow: 0px 0px 2px 0px black;

  will-change: transform;
`

const keyframesOldScore = keyframes`
    0% {transform: translate(-50%) scale(0); opacity: 0;}
    20% {transform: translate(-50%) scale(1); opacity: 1;}
    60% {transform: translate(0%) scale(1); opacity: 1;}
    80% {transform: translate(0%) scale(1); opacity: 1;}
    100% {transform: translate(0%) scale(0); opacity: 0;}
  `

const keyframesAddScore = keyframes`
    0% {transform: translate(50%) scale(0); opacity: 0;}
    20% {transform: translate(50%) scale(1); opacity: 1;}
    60% {transform: translate(0%) scale(1); opacity: 1;}
    80% {transform: translate(0%) scale(1); opacity: 0;}
    100% {transform: translate(0%) scale(0); opacity: 0;}
  `

const keyframesNewScore = keyframes`
    40% {transform: scale(1); opacity: 0;}
    80% {transform: scale(1); opacity: 1;}
    100% {transform: scale(0); opacity: 0;}
  `

const AddScore = styled(ScoreElement)`
  color: black;
  background-color: initial;

  box-shadow: unset;

  ${({ show }) => show ? `animation: ${keyframesAddScore} 3s;` : ""}
`

const OldScore = styled(ScoreElement)`
  ${({ show }) => show ? `animation: ${keyframesOldScore} 3s;` : ""}
`

const NewScore = styled(ScoreElement)`
  ${({ show }) => show ? `animation: ${keyframesNewScore} 3s;` : ""}
`

export default function Score({ oldScore, score, show }) {
  return (
    <ScoreContainer>
      <OldScore
        show={ show }>
        {
          oldScore
        }
      </OldScore>
      <AddScore
        show={ show }>
          + { score - oldScore }
      </AddScore>
      <NewScore
        show={ show }>
        {
          score
        }
      </NewScore>
    </ScoreContainer>
  )
}
