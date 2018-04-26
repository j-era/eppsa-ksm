import styled from "styled-components"

export default styled.div`
  box-sizing: border-box;
  padding: ${props => props.theme.layout.cardWidth / 100 * 7}vw;
  width: 100%;
  height: 100%;
`
