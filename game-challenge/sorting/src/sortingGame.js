import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import { ScoreCalculation, Button } from "eppsa-ksm-shared"

import pickBy from "lodash.pickby"
import mapValues from "lodash.mapvalues"

import DragDropList from "./dragDropList"

import ButtonIcon from "../node_modules/eppsa-ksm-shared/assets/EPPSA_Assets_Button_Icon.svg"

const Container = styled.div`
  font-family: ${props => props.theme.font.fontFamily};

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding-top: ${props => props.theme.layout.cardPadding}vw;
  padding-bottom: ${props => props.theme.layout.cardPadding}vw;

  height: 100%;

  box-sizing: border-box;
`

const NextIcon = styled(ButtonIcon)`
  margin-left: 1em;
  margin-top: 0.2em;
  height: 0.9em;
  fill: black;
`

const TopLabel = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.layout.mediumSpacing}vw;
`

const BottomLabel = styled.div`
  text-align: center;
`

export default class SortingGame extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)

    this.points = { bonus: 0, score: 0 }

    const items = Object.values(selectItems(this.props.data))
    console.log(items)

    this.state = {
      isConfirmed: false,
      isCorrect: false,
      isWrong: false,
      items
    }
  }

  componentDidMount() {
    this.startTime = new Date()
    const { sessionLength } = this.props.data.challenge.score
    const { showTimeline, startTimelineClock } = this.props.callbacks
    showTimeline(sessionLength)
    startTimelineClock()
    this.timeLineTimeout = setTimeout(() => {
      this.confirm()
    }, sessionLength * 1000)
  }

  render() {
    return (
      <Container>
        <div>
          <TopLabel>{ this.props.data.challenge.topLabel }</TopLabel>
          <DragDropList
            items={ this.state.items }
            isConfirmed={ this.state.isConfirmed }
            isCorrect={ this.state.isCorrect }
            isWrong={ this.state.isWrong }
            reorder={ this.reorder } />
          <BottomLabel>{ this.props.data.challenge.bottomLabel }</BottomLabel>
        </div>
        { !this.state.isConfirmed && this.renderConfirmButton() }
        { this.state.isConfirmed && this.renderProceedButton() }
      </Container>
    )
  }

  renderConfirmButton() {
    return (
      <Button onClick={ this.confirm }>
        { this.props.data.shared.texts.confirm }<NextIcon />
      </Button>
    )
  }

  confirm() {
    clearTimeout(this.timeLineTimeout)
    this.props.callbacks.stopTimelineClock()

    const { score } = this.props.data.challenge
    const { shared } = this.props.data

    this.timeNeeded = (new Date() - this.startTime) / 1000

    for (const [index, item] of this.state.itemsMap) {
      if (item.correctPosition - 1 !== index) {
        this.setState({
          isConfirmed: true,
          isCorrect: false,
          isWrong: true
        })
        return
      }
    }

    const scoreCalc = new ScoreCalculation(
      this.timeNeeded,
      { ...score, gameFactor: shared.config.sortingScoreFactor }
    )
    this.points = scoreCalc.getScore()

    this.setState({
      isConfirmed: true,
      isCorrect: true,
      isWrong: false
    })
  }

  renderProceedButton() {
    return (
      <Button onClick={ this.proceed }>
        { this.props.data.shared.texts.next } <NextIcon />
      </Button>
    )
  }

  proceed() {
    const { hideTimeline } = this.props.callbacks
    hideTimeline()

    console.log(`${this.points.score}, ${this.points.bonus}`)

    this.props.callbacks.finishChallenge(this.points.score + this.points.bonus)
  }

  reorder(dragItem, hoverItem) {
    // Don't trigger reorder if it's to the same spot
    if (dragItem.id === hoverItem.id) {
      return
    }

    const newItems = Array.from(this.state.items)

    const dragItemIndex = this.state.items.indexOf(dragItem)
    const hoverItemIndex = this.state.items.indexOf(hoverItem)

    newItems[dragItemIndex] = this.state.items[hoverItemIndex]
    newItems[hoverItemIndex] = this.state.items[dragItemIndex]

    this.setState({ items: newItems })
  }
}

function selectItems(data) {
  const items = pickBy(data.challenge, (object) => object.template === "sortingItem")
  return mapValues(items, (item) =>
    Object.assign(item, {
      image: {
        src: `${data.assetServerUri}/${item.image.src}`
      },
      id: `item${item.correctPosition}`
    })
  )
}
