import styled from "styled-components"
import Button from "./button"


const AnswerButton = styled(Button)`
  background-color: ${props => selectionColor(props.selection)};
`

function selectionColor(selection) {
  switch (selection) {
    case "right": return "green"
    case "wrong": return "red"
    default: return "grey"
  }
}

export default AnswerButton

AnswerButton.defaultProps = {
  selection: null
}
