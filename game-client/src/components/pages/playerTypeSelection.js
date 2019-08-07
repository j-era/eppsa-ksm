import React, { useMemo } from "react"
import styled from "styled-components"
import { PageTitle, Page, NextButton } from "eppsa-ksm-shared"

import { startNewGame } from "../../actionCreators"


const Container = styled(Page)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export default function PlayerTypeSelection({ content, dispatch }) {
  const types = useMemo(() => Object.entries(content)
    .filter(([, value]) => value.template && value.template === "challenges")
    .map(([key]) => key), [content])

  return (
    <Container>
      <PageTitle>Player Type Selection</PageTitle>
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
    </Container>
  )
}
