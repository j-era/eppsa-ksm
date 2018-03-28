import styled from "styled-components"
import Button from "./button"


const AnswerButton = styled(Button)`
  border-color: ${props => selectionColor(props.selection)};
`

function selectionColor(selection) {
  switch (selection) {
    case "right": return "#00d700"
    case "wrong": return "#f3352f"
    default: return "#000000"
  }
}

export default AnswerButton

AnswerButton.defaultProps = {
  selection: null
}
