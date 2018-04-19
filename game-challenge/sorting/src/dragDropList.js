import React from "react"
import { DragDropContext } from "react-dnd"
import styled from "styled-components"

import { default as TouchBackend } from "../lib/react-dnd-touch-backend/src/Touch"

import PreviewItem from "./previewItem"
import SortingItem from "./sortingItem"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

class DragDropList extends React.Component {
  render() {
    return (
      <Container className={ this.props.className }>
        {
          Array.from(this.props.itemsMap.keys()).map(
            (key) =>
              <SortingItem
                isCorrect={ this.props.isCorrect }
                isWrong={ this.props.isWrong }
                key={ key } index={ key }
                id={ this.props.itemsMap.get(key).id }
                item={ this.props.itemsMap.get(key) }
                onReorder={ this.props.reorder } />
          )
        }
        <PreviewItem />
      </Container>
    )
  }
}

export default DragDropContext(TouchBackend({ delayHoldTouchStart: 500 }))(DragDropList)
