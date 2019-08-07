import React, { useState } from "react"
import styled, { withTheme } from "styled-components"

import {
  Button,
  delay,
  Description,
  NextButton,
  Page,
  PageTitle
} from "eppsa-ksm-shared"

import { resumeGame, updateGameState } from "../../actionCreators"
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

const StyledDescription = styled(Description)`
  margin-top: ${props => props.theme.layout.smallSpacing}vw;
  max-height: calc(3em + ${props => props.theme.layout.smallSpacing}vw);
`

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
`

const ConfirmButton = styled(NextButton)`
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  border-color: ${props => props.theme.colors.primary};
`

const BackButton = styled(Button)`
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  align-self: center;
  border-color: ${props => props.theme.colors.secondary};
`

function ResumeOrNewGameSelection(props) {
  const [nextClicked, setNextClicked] = useState(false)
  const [backClicked, setBackClicked] = useState(false)

  const { content, dispatch, resumableGame } = props
  const { challengeNumber, score, playerType } = props.resumableGame

  return (
    <Container>
      <PageTitle>{ content.shared.texts.resumeGameTitle }</PageTitle>
      <Content>
        <StyledDescription>
          { content.shared.texts.resumeGameText }
        </StyledDescription>
        <StyledDescription>
          { `challengeNumber ${challengeNumber}` }
        </StyledDescription>
        <StyledDescription>
          { `score ${score}` }
        </StyledDescription>
        <StyledDescription>
          { `playerType ${playerType}` }
        </StyledDescription>
        <Buttons>
          <ConfirmButton
            visible
            onClick={ async () => {
              setNextClicked(true)
              await delay(100)
              dispatch(resumeGame(resumableGame))
            } }
            clicked={ nextClicked }
            text={ content.shared.texts.resumeGameButton } />
          <BackButton
            onClick={ async () => {
              setBackClicked(true)
              await delay(100)
              dispatch(updateGameState(gameStates.PLAYER_TYPE_SELECTION))
            } }
            clicked={ backClicked }>
            { content.shared.texts.newGameButton }
          </BackButton>
        </Buttons>
      </Content>
    </Container>
  )
}

export default withTheme(ResumeOrNewGameSelection)
