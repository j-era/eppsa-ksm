import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import "./App.css"
import AnswerButton from "./components/answerButton"
import Button from "./components/button"
import Question from "./components/question"
import ScoreCalculation from "./score"


const Container = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  width: 100%;
  height: 100%;
`

const NextChallengeButton = styled(Button)`
  background-color: grey;
`

const Score = styled.div`
  margin-top: 5px;
  width: 200px;
  height: 50px;
`

export default class App extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.points = { bonus: 0, score: 0 }
    this.state = { confirmed: false }
  }

  componentDidMount() {
    this.startTime = new Date()
  }

  render() {
    const { question } = this.props.content
    return (
      <Container>
        { this.renderScore() }
        <Question>{ question }</Question>
        { this.renderAnswers() }
        { this.renderNextButton() }
      </Container>
    )
  }

  renderAnswers() {
    const answers = [1, 2, 3, 4].map(i => this.props.content[`answer${i}`])

    return answers.map((answer, i) =>
      <AnswerButton
        key={ i }
        onClick={ () => this.confirm(i) }
        selection={ this.getSelection(i) }>
        {
          answer
        }
      </AnswerButton>
    )
  }

  renderScore() {
    return this.state.confirmed &&
      <Score>
        { this.points.score } +{ this.points.bonus }
      </Score>
  }

  renderNextButton() {
    return this.state.confirmed &&
      <NextChallengeButton onClick={ this.nextChallenge }>
        { this.props.content.shared.texts.next }
      </NextChallengeButton>
  }

  getSelection(i) {
    const { correctAnswer } = this.props.content
    if (this.state.confirmed) {
      if (i === correctAnswer - 1) {
        return "right"
      } else if (this.state.confirmed === i) {
        return "wrong"
      }
    }
  }

  confirm(answerIndex) {
    const { correctAnswer, scoreCalculation, shared } = this.props.content
    this.timeToAnswer = (new Date() - this.startTime) / 1000
    if (answerIndex === correctAnswer - 1) {
      const scoreCalc = new ScoreCalculation(
        this.timeToAnswer,
        { ...scoreCalculation, gameFactor: shared.config.quizFactor }
      )
      this.points = scoreCalc.getScore()
    }
    this.setState({ confirmed: answerIndex })
  }

  nextChallenge() {
    this.props.completeChallenge(this.points.score + this.points.bonus)
  }
}
