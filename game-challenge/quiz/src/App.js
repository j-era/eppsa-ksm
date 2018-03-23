import React from "react"
import "./App.css"
import styled from "styled-components"

const Container = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  width: 100%;
  height: 100%;
`
const Button = styled.div `
  margin-top: 5px;
  width: 200px;
  height: 100px;
`

const AnswerButton = styled(Button)`
  background-color: ${props => props.selected ? "red" : "grey"};
`

const ConfirmButton = styled(Button)`
  background-color: green;
`

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selected: null }
  }

  render() {
    return (
      <Container>
        {
          this.props.config.answers.map((answer, i) =>
            <AnswerButton
              key={ i }
              onClick={ () => this.select(i) }
              selected={ this.state.selected === i }>
              {
                answer.answer
              }
            </AnswerButton>
          )
        }
        <ConfirmButton>Confirm</ConfirmButton>
      </Container>
    )
  }

  select(n) {
    this.setState({ selected: this.state.selected === n ? null : n })
  }
}
