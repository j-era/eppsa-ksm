import React from "react"
import styled from "styled-components"
import { PageTitle, Page, FramedIcon } from "eppsa-ksm-shared"

const Container = styled(Page)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export default function PlayerTypeSelection({ content }) {
  const types = Object.entries(content)
    .filter(([, value]) => value.template && value.template === "challenges")
    .map(([key]) => key)

  return (
    <Container>
      <PageTitle>Player Type Selection</PageTitle>
      {
        types.map(type => <div key={ type }>{type}</div>)
      }
    </Container>
  )
}
