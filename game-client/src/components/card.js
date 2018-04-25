import styled from "styled-components"

export default styled.div`
  width: ${props => props.theme.layout.cardWidth}vw;
  height: ${props => props.theme.layout.cardHeight}vw;
  border-radius: ${props => props.theme.layout.cardBorderRadius};
  background-color: white;
`
