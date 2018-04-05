import React from "react"
import styled, { css, keyframes, withTheme } from "styled-components"
import Button from "./button"


const pulse = keyframes`
  0% { opacity: 1; }
  50%   {
    opacity: 0;
  }
  0% { opacity: 1; }
`

const StyledButton = styled(Button)`
  border-color: ${props => selectionColor(props.selection, props.theme)};
  ${props => selectionAnimation(props.selection)}
  ${props => props.visible ? css`
      transform: scale(1, 1);
      opacity: 1;
      transition:
        transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2) ${props => 250 + props.index * 150}ms,
        opacity  150ms ease ${props => 250 + props.index * 150}ms;
    ` : css`
      transform: scale(0, 0);
      opacity: 0;
    `
  }
`

const Title = styled.div`
  flex-basis: 10%;
  align-self: center;
  color: ${props => selectionColor(props.selection, props.theme)};
  opacity: 0.5;
`

const Answer = styled.div`
  flex-basis: 90%;
`

function selectionAnimation(selection) {
  const pulseAnimation = css`animation: ${pulse} 500ms ease 0ms 5;`
  switch (selection) {
    case "right": return pulseAnimation
    case "wrong": return pulseAnimation
    default: return ""
  }
}

function selectionColor(selection, theme) {
  switch (selection) {
    case "right": return theme.colors.rightAnswer
    case "wrong": return theme.colors.wrongAnswer
    case "greyed": return theme.colors.secondary
    default: return theme.colors.areaColor
  }
}

function AnswerButton(props) {
  return (
    <StyledButton { ...props }>
      <Title selection={ props.selection }>{ props.title }:</Title>
      <Answer>{ props.answer }</Answer>
    </StyledButton>
  )
}

export default withTheme(AnswerButton)

AnswerButton.defaultProps = {
  selection: null
}
