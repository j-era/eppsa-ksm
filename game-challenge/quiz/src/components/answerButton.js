import React from "react"
import styled, { css, keyframes, withTheme } from "styled-components"
import Button from "./button"


function pulse(areaColor, blinkColor, blinking, colorType) {
  const { duration, repeats } = blinking
  const blink = keyframes`
    0% { ${colorType}: ${areaColor}; }
    50%   { ${colorType}: ${blinkColor}; }
    100% { ${colorType}: ${areaColor}; }
  `
  return css`animation: ${blink} ${duration}ms ease 0ms ${repeats};`
}

const StyledButton = styled(Button)`
  border-color: ${props => selectionColor(props.selection, props.theme)};
  ${props =>
    selectionAnimation(
      props.selection,
      props.blinking,
      props.theme.colors.areaColor,
      "border-color",
      props.theme
    )
  };
  ${props => props.visible ? css`
      transform: scale(1, 1);
      transition:
        transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2) ${props =>
          250 + props.index * 150
        }ms,
        opacity  150ms ease ${props => 250 + props.index * 150}ms;
    ` : css`
      transform: scale(0, 0);
      opacity: 0;
    `
  }
  ${props => props.selection === "greyed" ? css`
    opacity: 0.8;
    transition: opacity ${props.greyOutDuration}ms ease;
  ` : css`
    opacity: 1;
  `}
`

const Title = styled.div`
  flex-basis: 10%;
  align-self: center;
  color: ${props => selectionColor(props.selection, props.theme)};
  opacity: 0.5;
`

const Answer = styled.div`
  flex-basis: 90%;
  padding-right: 10%;
  color: ${props => props.selection === "greyed"
    ? props.theme.colors.secondaryFont
    : props.theme.colors.primaryFont};
  }
`

function selectionAnimation(selection, blinking, initialColor, colorType, theme) {
  const { rightAnswer, wrongAnswer } = theme.colors
  switch (selection) {
    case "right": return pulse(initialColor, rightAnswer, blinking, colorType)
    case "wrong": return pulse(initialColor, wrongAnswer, blinking, colorType)
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
      <Answer { ...props }>{ props.answer }</Answer>
    </StyledButton>
  )
}

export default withTheme(AnswerButton)

AnswerButton.defaultProps = {
  selection: null
}
