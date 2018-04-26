import React from "react"
import styled, { withTheme } from "styled-components"
import { Description, FramedIcon, NextButton, Page, PageTitle } from "eppsa-ksm-shared"

import { updateGameState } from "../../actionCreators"
import { QR_READER } from "../../gameStates"

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

function NavigationToNextArea(props) {
  const title = props.content.challenges[props.challengeNumber].description

  return (
    <Container>
      <PageTitle text={ title } />
      <Content>
        <FramedIcon color={ props.theme.colors.area } />
        <Description>
        Gehe zum nächsten Bereich und scanne den QR-Code
        </Description>
        <NextButton
          visible
          onClick={ () => props.dispatch(updateGameState(QR_READER)) }
          text="QR-Code Scannen" />
      </Content>
    </Container>
  )
}

export default withTheme(NavigationToNextArea)
