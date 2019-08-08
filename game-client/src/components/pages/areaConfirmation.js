import React from "react"
import styled, { withTheme } from "styled-components"
import { Description, FramedIcon, NextButton, Page, PageTitle } from "eppsa-ksm-shared"

import { confirmArea } from "../../actionCreators"

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
  padding-left: ${props => props.theme.layout.cardViewWidth * 0.12}vw;
  padding-right: ${props => props.theme.layout.cardViewWidth * 0.12}vw;
`

function AreaConfirmation(props) {
  const { assetServerUri, challengeNumber, content, theme, playerType, dispatch } = props
  const challenge = playerType && challengeNumber ? content[playerType][challengeNumber] : null

  return (
    <Container>
      <PageTitle>{ challenge.name }</PageTitle>
      <Content>
        <FramedIcon
          scale={ 0.78 }
          color={ theme.colors.area }
          iconSrc={ `${assetServerUri}/${challenge.icon.src}` } />
        <StyledDescription>
          { challenge.areaConfirmationText || content.shared.texts.areaConfirmationText }
        </StyledDescription>
        <NextButton
          visible
          onClick={ () => {
            dispatch(confirmArea())
          } }
          text={ content.shared.texts.next } />
      </Content>
    </Container>
  )
}

export default withTheme(AreaConfirmation)
