import React from "react"
import styled, { withTheme } from "styled-components"
import { Description, NextButton, Page, PageTitle } from "eppsa-ksm-shared"

import { updateGameState } from "../../actionCreators"
import * as gameStates from "../../gameStates"

const Container = styled(Page)`
  display: flex;
  flex-direction: column;
`

const Content = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

function ChallengeResult({ challengeData, content, dispatch }) {
  const name = challengeData.challenge.name
  const description = challengeData.challenge.manualText

  return (
    <Container>
      <PageTitle>{ name }</PageTitle>
      <Content>
        <Description>
          { description }
        </Description>
        <NextButton
          visible
          onClick={ () => dispatch(updateGameState(gameStates.AREA_CONFIRMATION)) }
          text={ content.shared.texts.next } />
      </Content>
    </Container>
  )
}

export default withTheme(ChallengeResult)
