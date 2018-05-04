import styled from "styled-components"

export default styled.div`
  width: ${props =>
    props.small ?
      props.theme.layout.smallCardViewWidth :
      props.theme.layout.largeCardViewWidth}vw;
  height: ${props => props.small ?
    props.theme.layout.smallCardViewWidth / props.theme.layout.cardRatio :
    props.theme.layout.largeCardViewWidth / props.theme.layout.cardRatio}vw;
  border-radius: ${props => props.theme.layout.cardBorderRadius};
  background-color: white;
  overflow: hidden;
  transition: width 0.5s ease, height 0.5s ease;
`
