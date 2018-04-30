import React from "react"
import styled from "styled-components"

const Container = styled.div`
  height: 100%;
  width: 60vw;
  margin: auto;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Text = styled.div`
  text-align: center;
`

const Score = styled.div`
  text-align: center;
  margin-top: 5vw;
`

export default function Finished(props) {
  return (
    <Container>
      <Text>{ props.content.finishText }</Text>
      <Score>{ props.score }</Score>
    </Container>
  )
}
