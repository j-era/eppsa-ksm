import React from "react"
import styled from "styled-components"

import { Description, PageTitle, QrReader } from "eppsa-ksm-shared"

import { handleChallengeQrCode, handleQrReaderError } from "../../actionCreators"

const Container = styled.div `
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Content = styled.div `
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledDescription = styled(Description)`
  margin-top: ${props => props.theme.layout.largeSpacing}vw;
  padding-left: ${props => props.theme.layout.cardWidth * 0.15}vw;
  padding-right: ${props => props.theme.layout.cardWidth * 0.15}vw;
`

export default ({ challengeNumber, content, dispatch }) => {
  const challenge = content.challenges[challengeNumber]

  return (
    <Container>
      <PageTitle text={ challenge.description } />
      <Content>
        <QrReader
          size={ 0.8 }
          background={ challenge.color }
          transparency
          seekerColor="white"
          onScan={ (data) => dispatch(handleChallengeQrCode(data, challenge)) }
          onError={ (error) => dispatch(handleQrReaderError(error)) } />
        <StyledDescription
          onClick={ process.env.NODE_ENV === "development"
            ? () => dispatch(handleChallengeQrCode(challenge.token, challenge))
            : () => {} }>
          { content.shared.texts.scanQrInstructions }
        </StyledDescription>
      </Content>
    </Container>
  )
}
