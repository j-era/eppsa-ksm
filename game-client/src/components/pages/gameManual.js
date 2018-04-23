import React from "react"
import styled from "styled-components"
import { NextButton, PageTitle, StyledMarkdown } from "eppsa-ksm-shared"

import { showGameManual } from "../../actionCreators"

const Container = styled.div `
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ManualText = styled.div`
  display: flex;
  flex-shrink: 0.2;
`

export default function gameManual(props) {
  return (
    <Container>
      <PageTitle text={ props.content.gameManualTitle } />
      <ManualText>
        <StyledMarkdown>{ props.content.gameManualText }</StyledMarkdown>
      </ManualText>
      <NextButton
        visible
        onClick={ () => props.dispatch(showGameManual(false)) }
        text="Ok" />
    </Container>
  )
}
