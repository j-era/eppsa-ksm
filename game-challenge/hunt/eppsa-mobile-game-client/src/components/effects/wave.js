import React from "react"
import styled from "styled-components"

const Container = styled.div`
  width: 100%;
  height: 100%;

  position: relative;
  
  display: flex;
  justify-content: center;
  align-items: center;
`

const Wave = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  
  border-radius: 50%;
  
  transform: scale(0.1);
  
  ${props => props.visible
    ? `
    opacity: 1;
    transform: scale(1.0);
    transition: transform 100ms linear;
    `
    : `
    opacity: 0;
    `};
  
  background: gainsboro;
`

export default (props) =>
  <Container>
    <Wave visible={ props.visible } />
  </Container>
