import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import { ScoreCalculation, Button } from "eppsa-ksm-shared"

import pickBy from "lodash.pickby"
import mapValues from "lodash.mapvalues"
import orderBy from "lodash.orderby"

import DragDropList from "./dragDropList"

import ButtonIcon from "../node_modules/eppsa-ksm-shared/assets/EPPSA_Assets_Button_Icon.svg"

const Container = styled.div`
  font-family: ${props => props.theme.font.fontFamily};

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: ${props => props.theme.layout.cardPadding};

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
  font-size: ${props => props.theme.font.text.size}vw;
`

const BottomLabel = styled.div`
  text-align: center;
  font-size: ${props => props.theme.font.text.size}vw;
`

export default class SortingGame extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)

    this.points = { bonus: 0, score: 0 }

    const items = orderBy(Object.values(selectItems(this.props.data)), ["initialPosition"])

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
      <Button onClick={ () => this.confirm(true) }>
        { this.props.data.shared.texts.confirm }<NextIcon />
      </Button>
    )
  }

  confirm(stopTimeline) {
    clearTimeout(this.timeLineTimeout)

    if (stopTimeline) {
      this.props.callbacks.stopTimelineClock()
    }

    const { score } = this.props.data.challenge
    const { shared } = this.props.data

    this.timeNeeded = (new Date() - this.startTime) / 1000

    for (let position = 0; position < this.state.items.length; position++) {
      const item = this.state.items[position]
      if (position !== item.correctPosition - 1) {
        this.setState({
          isConfirmed: true,
          isCorrect: false,
          isWrong: true,
          items: orderBy(this.state.items, ["correctPosition"])
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
