import styled from "styled-components"

export default styled.div`
  width: ${props => props.theme.layout.cardViewWidth * props.ratio}vw;
  height: ${props => props.theme.layout.cardViewHeight * props.ratio}vw;
  border-radius: ${props => props.theme.layout.cardBorderRadius};
  background-color: white;
  overflow: hidden;
`
