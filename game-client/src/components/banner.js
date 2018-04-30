import styled from "styled-components"

export default styled.div`
  font-size: ${props => props.theme.font.headline.size}vw;
  font-weight: ${props => props.theme.font.headline.weight};
  color: white;

  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.layout.borderRadius};

  display: flex;
  justify-content: center;
  align-items: center;

  padding-top: 0.25em;
  padding-bottom: 0.25em;
  padding-left: 0.7em;
  padding-right: 0.7em;
`
