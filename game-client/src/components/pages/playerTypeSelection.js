import React, { useMemo } from "react"
import styled from "styled-components"
import { PageTitle, Description, Page, NextButton } from "eppsa-ksm-shared"

import { startNewGame } from "../../actionCreators"


const Container = styled(Page)`
  display: flex;
  flex-direction: column;
`

const Content = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`

export default function PlayerTypeSelection({ content, dispatch }) {
  const types = useMemo(() => Object.entries(content)
    .filter(([, value]) => value.template && value.template === "challenges")
    .map(([key]) => key), [content])

  return (
    <Container>
      <PageTitle>{content.shared.texts.playerTypeSelectionTitle}</PageTitle>
      <Content>
        <Description>{ content.shared.texts.playerTypeSelectionDescription }</Description>
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
      </Content>
    </Container>
  )
}
