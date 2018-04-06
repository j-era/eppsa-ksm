import styled from "styled-components"


export default styled.div`
  font-size: ${props => props.theme.font.text.size};
  font-weight: ${props => props.theme.font.text.weight};
  color: ${props => props.theme.font.text.color};
  text-align: center;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 250ms linear;
`
