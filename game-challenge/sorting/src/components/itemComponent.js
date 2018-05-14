import React from "react"
import styled from "styled-components"

export default styled.div`
  height: 15vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: ${props => props.theme.layout.cardBorderRadius};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: ${props => props.theme.font.button.size}vw;
`
