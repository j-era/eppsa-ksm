import React, { useMemo } from "react"
import styled from "styled-components"
import { PageTitle, Description, Page, NextButton } from "eppsa-ksm-shared"

import { startNewGame } from "../../actionCreators"


const Container = styled(Page)`
  display: flex;
  flex-direction: column;
`

const StyledDescription = styled(Description)`
  margin-top: ${props => props.theme.layout.smallSpacing}vw;
  max-height: calc(3em + ${props => props.theme.layout.smallSpacing}vw);
`

const Content = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`

const Buttons = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 30%;
`

export default function PlayerTypeSelection({ content, dispatch }) {
  const types = useMemo(() => Object.entries(content)
    .filter(([, value]) => value.template && value.template === "challenges")
    .map(([key]) => key), [content])

  return (
    <Container>
      <PageTitle>{content.shared.texts.playerTypeSelectionTitle}</PageTitle>
      <StyledDescription>{ content.shared.texts.playerTypeSelectionDescription }</StyledDescription>
      <Content>
        <Buttons>
          {
            types.map(
              type =>
                <NextButton
                  visible
                  key={ type }
                  onClick={ () => {
                    dispatch(startNewGame(type))
                  } }
                  text={ type } />
            )
          }
        </Buttons>
      </Content>
    </Container>
  )
}
