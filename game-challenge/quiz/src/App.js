import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import "./App.css"
import Button from "./components/button"
import Question from "./components/question"


const Container = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  width: 100%;
  height: 100%;
`

const AnswerButton = styled(Button)`
  background-color: ${props => props.color};
`

const ConfirmButton = styled(Button)`
  background-color: ${props => props.active ? "blue" : "grey"};
`

const NextChallengeButton = styled(Button)`
  background-color: blue;
`

const Score = styled.div`
  margin-top: 5px;
  width: 200px;
  height: 100px;
`

export default class App extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { selected: null, confirmed: false }
  }

  componentDidMount() {
    this.startTime = new Date()
  }

  render() {
    const { question, answers } = this.props.config
    return (
      <Container>
        {
          this.state.confirmed && <Score>Score: { this.score }, Time:{ this.timeToAnswer }</Score>
        }
        <Question>{ question }</Question>
        {
          answers.map((answer, i) =>
            <AnswerButton
              key={ i }
              onClick={ () => this.select(i) }
              color={ this.buttonColor(i) }>
              {
                answer.answer
              }
            </AnswerButton>
          )
        }
        {
          !this.state.confirmed &&
          <ConfirmButton
            onClick={ this.confirm }
            active={ this.state.selected != null }>
            Confirm
          </ConfirmButton>
        }
        {
          this.state.confirmed &&
            <NextChallengeButton onClick={ this.nextChallenge }>
              Go to next challenge
            </NextChallengeButton>
        }
      </Container>
    )
  }

  buttonColor(i) {
    const { answers } = this.props.config
    if (this.state.confirmed) {
      if (answers[i].isCorrect) {
        return "green"
      } else if (this.confirmedSelection === i) {
        return "red"
      } else {
        return "grey"
      }
    } else {
      return this.state.selected === i ? "blue" : "grey"
    }
  }

  select(n) {
    this.setState({ selected: this.state.confirmed || this.state.selected === n ? null : n })
  }

  confirm() {
    if (this.state.selected != null) {
      const { answers, reward, maxAnsweringTime } = this.props.config
      this.timeToAnswer = (new Date() - this.startTime) / 1000
      const timeWeight = this.timeToAnswer > maxAnsweringTime
        ? 1 / (this.timeToAnswer - maxAnsweringTime)
        : 1
      const finalAnswer = answers[this.state.selected]
      this.score = Math.round(finalAnswer.isCorrect ? reward * timeWeight : 0)
      this.confirmedSelection = this.state.selected
      this.setState({ selected: null, confirmed: true })
    }
  }

  nextChallenge() {
    this.props.completeChallenge(this.score)
  }
}
