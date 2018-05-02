import React from "react"
import styled, { css } from "styled-components"

const ScoreContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 10vw;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Score = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.font.button.size}vw;
  background-color: ${props => props.theme.colors.area};
  color: white;
  padding-left: 1em;
  padding-right: 1em;
  height: 1.2em;
  border-radius: ${props => props.theme.layout.borderRadius};
  ${props => props.visible
    ? css`
      transform: scale(1, 1);
      opacity: 1;
      transition:
        transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2) 500ms,
        opacity  150ms ease 500ms;
    `
    : css`
      transform: scale(0, 0);
      opacity: 0;
      transition:
        transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2),
        opacity  150ms ease;
    `}
`

export default props =>
  <ScoreContainer>
    <Score visible={ props.visible }>{ props.text }</Score>
  </ScoreContainer>
