import React from "react"
import styled from "styled-components"
import { NextButton, Page, PageTitle, StyledMarkdown } from "eppsa-ksm-shared"

import { setShowGameManual, updateGameState } from "../../actionCreators"
import * as gameStates from "../../gameStates"

const Container = styled(Page)`
  display: flex;
  flex-direction: column;
`

const StyledNextButton = styled(NextButton)`
   ${props => props.isInitial && `border-color: ${props.theme.colors.primary}`};
`

export default function GameManual({ content, gameState, playerType, dispatch }) {
  return (
    <Container>
      <PageTitle>{ content[playerType].gameManualTitle }</PageTitle>
      <StyledMarkdown>{ content[playerType].gameManualText }</StyledMarkdown>
      <StyledNextButton
        isInitial={ gameState === gameStates.INITIAL_GAME_MANUAL }
        visible
        onClick={ () => {
          if (gameState === gameStates.INITIAL_GAME_MANUAL) {
            dispatch(updateGameState(gameStates.AREA_CONFIRMATION))
          } else {
            dispatch(setShowGameManual(false))
          }
        } }
        text={ gameState === gameStates.INITIAL_GAME_MANUAL ? "Los geht's" : "OK" } />
    </Container>
  )
}
