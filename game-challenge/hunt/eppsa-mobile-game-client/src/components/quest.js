import React from "react"
import styled from "styled-components"

const Container = styled.div`
  width: 80%;
  height: 80%;
  
  display: flex;
  flex-direction: column;
  align-items: center;  
  justify-content: space-around;

  padding: 10px;
`

const Name = styled.div`
  font-size: 10vmin;
`

const Description = styled.div`
  width: 70vw;
  max-height: 30%;
    
  text-align: center;
    
  text-overflow: ellipsis;
  overflow: hidden;
`

export default ({ quest }) =>
  <Container>
    <Name>{ quest.name }</Name>
    <Description>{ quest.description }</Description>
  </Container>
