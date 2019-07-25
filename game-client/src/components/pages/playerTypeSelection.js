import React from "react"
import styled from "styled-components"
import { PageTitle, Page, Description } from "eppsa-ksm-shared"

import { setPlayerType } from "../../actionCreators"


const Container = styled(Page)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledDescription = styled(Description)`
  margin-top: ${props => props.theme.layout.smallSpacing}vw;
  max-height: calc(3em + ${props => props.theme.layout.smallSpacing}vw);
`

export default function PlayerTypeSelection({ content, dispatch }) {
  const types = Object.entries(content)
    .filter(([, value]) => value.template && value.template === "challenges")
    .map(([key]) => key)

  return (
    <Container>
      <PageTitle>Player Type Selection</PageTitle>
      {
        types.map(
          type =>
            <StyledDescription
              key={ type }
              onClick={ () => {
                dispatch(setPlayerType(type))
              } }>
              {type}
            </StyledDescription>
        )
      }
    </Container>
  )
}
