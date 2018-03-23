import React from "react"
import autoBind from "react-autobind"
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

const Question = styled.div`
  margin-top: 5px;
  width: 200px;
  height: 100px;
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
  background-color: ${props => props.active ? "green" : "grey"};
`

export default class App extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { selected: null }
  }

  render() {
    const { question, answers } = this.props.config
    return (
      <Container>
        <Question>{ question }</Question>
        {
          answers.map((answer, i) =>
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
        <ConfirmButton
          onClick={ this.confirm }
          active={ this.state.selected != null }>
          Confirm
        </ConfirmButton>
      </Container>
    )
  }

  select(n) {
    this.setState({ selected: this.state.selected === n ? null : n })
  }

  confirm() {
    if (this.state.selected != null) {
      const { answers, reward } = this.props.config
      const finalAnswer = answers[this.state.selected]
      this.props.completeChallenge(finalAnswer.isCorrect ? reward : 0)
    }
  }
}
