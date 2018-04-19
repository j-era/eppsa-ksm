import styled from "styled-components"

const maxWidth = 98 // maximal relative width
const maxRatio = 0.46 // maximal expected display ratio (1:2)
const cardRatio = 2 / 3

export default styled.div`
  width: ${props => (1 + maxRatio - props.innerRatio) * maxWidth}vw;
  height: ${props => (1 + maxRatio - props.innerRatio) * maxWidth / cardRatio}vw;
  border-radius: ${props => props.theme.layout.cardBorderRadius};
  background-color: white;
`
