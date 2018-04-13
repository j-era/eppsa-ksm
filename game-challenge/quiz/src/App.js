import React from "react"
import autoBind from "react-autobind"
import styled, { ThemeProvider } from "styled-components"
import delay from "./delay"
import AnswerButton from "./components/answerButton"
import NextButton from "./components/nextButton"
import QuestionText from "./components/questionText"
import QuestionTitle from "./components/questionTitle"
import ScoreCalculation from "../lib/eppsa-ksm-shared/functions/score"
import theme from "../lib/eppsa-ksm-shared/styled-components/theme"


const Container = styled.div `
  font-family: ${props => props.theme.font.fontFamily};
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: ${props => props.theme.layout.offsetX};
  padding-right: ${props => props.theme.layout.offsetX};
  height: 100vh;
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
      showNext: false,
      nextClicked: false
    }
  }

  componentDidMount() {
    this.startTime = new Date()
    setTimeout(() => this.setState({ visible: true }), 0)
  }

  render() {
    const { question } = this.props.content.challenge
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
    const answers = [1, 2, 3, 4].map(i => this.props.content.challenge[`answer${i}`])
    const titles = ["A", "B", "C", "D"]

    return answers.map((answer, i) =>
      <AnswerButton
        key={ i + 1 }
        visible={ this.state.visible }
        onClick={ !this.state.confirmed ? () => this.confirm(i + 1) : () => {} }
        clicked={ this.state.confirmed === i + 1 }
        selection={ this.getSelection(i + 1) }
        initialDelay={ this.questionFadeIn }
        blinking={ this.blinking }
        greyOutDuration={ this.greyOutDuration }
        answer={ answer }
        title={ titles[i] }
        index={ i } />
    )
  }

  renderNextButton() {
    return <NextButton
      visible={ this.state.showNext }
      onClick={ async () => await this.nextChallenge() }
      clicked={ this.state.nextClicked }
      text={ this.props.content.shared.texts.next } />
  }

  getSelection(i) {
    const { correctAnswer } = this.props.content.challenge
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
    const { correctAnswer, score } = this.props.content.challenge
    const { shared } = this.props.content

    this.timeToAnswer = (new Date() - this.startTime) / 1000
    if (answerIndex === correctAnswer) {
      const scoreCalc = new ScoreCalculation(
        this.timeToAnswer,
        { ...score, gameFactor: shared.config.quizFactor }
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

  async nextChallenge() {
    this.setState({ nextClicked: true })
    await delay(100)
    this.props.completeChallenge(this.points.score + this.points.bonus)
  }
}
