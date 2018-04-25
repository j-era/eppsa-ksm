import styled from "styled-components"

export default styled.div`
  font-size: ${props => props.theme.font.headline.size}vw;
  font-weight: ${props => props.theme.font.headline.weight};
  color: ${props => props.theme.font.headline.color};
  text-align: center;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity ${props => props.fadeIn}ms linear;
`
