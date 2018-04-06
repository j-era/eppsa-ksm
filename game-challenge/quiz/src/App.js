import React from "react"
import autoBind from "react-autobind"
import delay from "delay"
import styled, { ThemeProvider } from "styled-components"
import "./App.css"
import AnswerButton from "./components/answerButton"
import NextButton from "./components/nextButton"
import QuestionText from "./components/questionText"
import QuestionTitle from "./components/questionTitle"
import ScoreCalculation from "./score"
import theme from "./theme"


const Container = styled.div `
  font-family: ${props => props.theme.font.fontFamily};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: ${props => props.theme.layout.offsetX};
  padding-right: ${props => props.theme.layout.offsetX};
  height: 100%;
`

export default class App extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.points = { bonus: 0, score: 0 }
    this.blinking = { duration: 250, repeats: 3 }
    this.questionFadeIn = 250
    this.greyOutDuration = 150
    this.state = {
      visible: false,
      confirmed: false,
      showRight: false,
      greyOut: false,
      showNext: false
    }
  }

  componentDidMount() {
    this.startTime = new Date()
    setTimeout(() => this.setState({ visible: true}), 0)
  }

  render() {
    const { question } = this.props.content
    theme.colors.areaColor = this.props.areaColor
    return (
      <ThemeProvider theme={ theme }>
        <Container>
          <QuestionTitle
            fadeIn={ this.questionFadeIn }
            visible={ this.state.visible }>
            {
              this.props.content.shared.texts.questionTitle
            }
          </QuestionTitle>
          <QuestionText
            fadeIn={ this.questionFadeIn }
            visible={ this.state.visible }>
            {
              question
            }
          </QuestionText>
          { this.renderAnswers() }
          { this.renderNextButton() }
        </Container>
      </ThemeProvider>
    )
  }

  renderAnswers() {
    const answers = [1, 2, 3, 4].map(i => this.props.content[`answer${i}`])
    const titles = ["A", "B", "C", "D"]

    return answers.map((answer, i) =>
      <AnswerButton
        key={ i + 1 }
        visible={ this.state.visible }
        onClick={ !this.state.confirmed ? () => this.confirm(i + 1) : () => {} }
        selection={ this.getSelection(i + 1) }
        initialDelay={ this.questionFadeIn }
        blinking={ this.blinking }
        greyOutDuration={ this.greyOutDuration }
        answer={ answer }
        title={ titles[i] }
        index={ i }>
      </AnswerButton>
    )
  }

  renderNextButton() {
    return <NextButton
        visible={ this.state.showNext }
        onClick={ this.nextChallenge }
        text={ this.props.content.shared.texts.next } />
  }

  getSelection(i) {
    const { correctAnswer } = this.props.content
    if (this.state.confirmed) {
      if (i === correctAnswer && this.state.showRight) {
        return "right"
      } else if (this.state.confirmed === i) {
        return "wrong"
      } else if (this.state.greyOut) {
        return "greyed"
      }
    }
  }

  confirm(answerIndex) {
    const { correctAnswer, scoreCalculation, shared } = this.props.content
    this.timeToAnswer = (new Date() - this.startTime) / 1000
    if (answerIndex === correctAnswer) {
      const scoreCalc = new ScoreCalculation(
        this.timeToAnswer,
        { ...scoreCalculation, gameFactor: shared.config.quizFactor }
      )
      this.points = scoreCalc.getScore()
      this.setState({ confirmed: answerIndex })
      this.animateAnswers(true)
    } else {
      this.setState({ confirmed: answerIndex })
      this.animateAnswers(false)
    }
  }

  async animateAnswers(correct) {
    !correct && await delay(this.blinking.duration * this.blinking.repeats)
    this.setState({ showRight: true })
    await delay(this.blinking.duration * this.blinking.repeats)
    this.setState({ greyOut: true })
    await delay(this.greyOutDuration)
    this.setState({ showNext: true })
  }

  nextChallenge() {
    this.props.completeChallenge(this.points.score + this.points.bonus)
  }
}
