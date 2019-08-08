import React from "react"
import styled, { withTheme } from "styled-components"
import { Description, FramedIcon, NextButton, Page, PageTitle } from "eppsa-ksm-shared"

import { startChallenge } from "../../actionCreators"

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

function ChallengeManual({ assetServerUri, challengeData, content, theme, dispatch }) {
  const name = challengeData.challenge.name
  const icon = challengeData.challenge.icon ||
                  content.shared.assets[`${challengeData.challenge.template}Icon`]
  const description = challengeData.challenge.manualText

  return (
    <Container>
      <PageTitle>{ name }</PageTitle>
      <Content>
        <FramedIcon
          scale={ 0.78 }
          color={ theme.colors.area }
          iconSrc={ `${assetServerUri}/${icon.src}` } />
        <Description>
          { description }
        </Description>
        <NextButton
          visible
          onClick={ () => {
            dispatch(startChallenge())
          } }
          text={ content.shared.texts.next } />
      </Content>
    </Container>
  )
}

export default withTheme(ChallengeManual)
