import React from "react"
import styled from "styled-components"

export default styled.div`
  height: 15vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: ${props => props.theme.layout.cardBorderRadius};
`
