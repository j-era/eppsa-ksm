import React, { useState, useMemo } from "react"
import styled from "styled-components"
import { PageTitle, Page, NextButton, delay } from "eppsa-ksm-shared"

import { setPlayerType } from "../../actionCreators"


const Container = styled(Page)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export default function PlayerTypeSelection({ content, dispatch }) {
  const [typesClicked, setTypesClicked] = useState({})
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
              clicked={ typesClicked[type] === true }
              onClick={ async () => {
                setTypesClicked(typesClicked => ({ ...typesClicked, [type]: true }))
                await delay(100)
                dispatch(setPlayerType(type))
              } }
              text={ type } />
        )
      }
    </Container>
  )
}
