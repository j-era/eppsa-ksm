import React from "react"
import styled, { withTheme } from "styled-components"

import {
  Button,
  Description,
  NextButton,
  Page,
  PageTitle,
  FramedIcon
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
  const { assetServerUri, content, dispatch, theme, resumableGame } = props
  const { challengeNumber, playerType } = resumableGame
  const challenge = playerType && challengeNumber ? content[playerType][challengeNumber] : null

  return (
    <Container>
      <PageTitle>{ content.shared.texts.resumeGameTitle }</PageTitle>
      <Content>
        <StyledDescription>
          { content.shared.texts.resumeGameText }
        </StyledDescription>
        <FramedIcon
          scale={ 0.78 }
          color={ theme.colors.area }
          iconSrc={ `${assetServerUri}/${challenge.icon.src}` } />
        <Buttons>
          <ConfirmButton
            visible
            onClick={ () => {
              dispatch(resumeGame(resumableGame))
            } }
            text={ content.shared.texts.resumeGameButton } />
          <BackButton
            onClick={ () => {
              dispatch(updateGameState(gameStates.PLAYER_TYPE_SELECTION))
            } }>
            { content.shared.texts.newGameButton }
          </BackButton>
        </Buttons>
      </Content>
    </Container>
  )
}

export default withTheme(ResumeOrNewGameSelection)
