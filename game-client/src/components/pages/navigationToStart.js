import React from "react"
import styled from "styled-components"
import { NextButton, PageTitle, StyledMarkdown } from "eppsa-ksm-shared"

import { updateGameState } from "../../actionCreators"
import { NEW_GAME_AVATAR_SELECTION } from "../../gameStates"

const Container = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const ManualText = styled.div`
  display: flex;
  flex-shrink: 0.2;
`

export default function NavigationToStart({ content, dispatch }) {
  return (
    <Container>
      <PageTitle>{ content.navigationToStartTitle }</PageTitle>
      <ManualText>
        <StyledMarkdown>{ content.navigationToStartText }</StyledMarkdown>
      </ManualText>
      <NextButton
        visible
        onClick={ () => dispatch(updateGameState(NEW_GAME_AVATAR_SELECTION)) }
        text="Ok" />
    </Container>
  )
}
