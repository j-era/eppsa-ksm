import React from "react"
import styled from "styled-components"

import { Description, ErrorMessage, Page, PageTitle, QrReader } from "eppsa-ksm-shared"

import {
  handleChallengeQrCode,
  handleQrReaderError,
  handleChallengeCode
} from "../../actionCreators"

const Container = styled(Page)`
  display: flex;
  flex-direction: column;
`

const Content = styled.div `
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledDescription = styled(Description)`
  margin-bottom: ${props => props.theme.layout.mediumSpacing}vw;
  padding-left: ${props => props.theme.layout.cardViewWidth}vw;
  padding-right: ${props => props.theme.layout.cardViewWidth}vw;
`

const StyledErrorMessage = styled(ErrorMessage)`
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  padding-left: ${props => props.theme.layout.cardViewWidth}vw;
  padding-right: ${props => props.theme.layout.cardViewWidth}vw;
`

const StyledInput = styled.input`
  margin-bottom: ${props => props.theme.layout.mediumSpacing}vw;
  font-size: ${props => props.theme.font.button.size}vw;
  text-align: center;
  border-radius: ${props => props.theme.layout.borderRadius};
  border-style: solid;
  border-width: ${props => props.theme.layout.buttonBorder};
  outline: none;
  
  border-color: ${props => {
    switch (props.codeInput) {
      case "CORRECT":
        return props.theme.colors.rightAnswer
      case "WRONG":
        return props.theme.colors.wrongAnswer
      default:
        return props.theme.colors.secondaryFont
    }
  }};
`

export default ({
  challengeNumber,
  content,
  dispatch,
  wrongQrCodeScanned,
  challengeCodeInput }) => {
  const challenge = content.challenges[challengeNumber]

  return (
    <Container>
      <PageTitle>{ challenge.name }</PageTitle>
      <Content>
        {
          wrongQrCodeScanned ?
            <StyledErrorMessage>
              { content.shared.texts.scanQrErrorInstructions }
            </StyledErrorMessage> :
            <StyledDescription
              onClick={ process.env.NODE_ENV === "development"
                ? () => dispatch(handleChallengeQrCode(
                  `http://development/?token=${challenge.token}`,
                  challenge
                ))
                : () => {} }>
              { content.shared.texts.scanQrInstructions }
            </StyledDescription>
        }
        <StyledInput
          codeInput={ challengeCodeInput }
          placeholder={ "Zahlencode" }
          type={ "text" }
          onInput={
            event => onCodeInput(event, dispatch, challenge)
          } />
        <QrReader
          scale={ 1 }
          background={ challenge.color }
          transparency
          seekerColor="white"
          onScan={ (data) => dispatch(handleChallengeQrCode(data, challenge)) }
          onError={ (error) => dispatch(handleQrReaderError(error)) } />
      </Content>
    </Container>
  )
}

function onCodeInput(event, dispatch, challenge) {
  const target = event.target

  if (target.value.length > challenge.code.length) {
    target.value = target.value.substr(0, challenge.code.length)
  }

  dispatch(handleChallengeCode(target.value, challenge))
}
