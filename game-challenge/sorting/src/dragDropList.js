import autoBind from "react-autobind"
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

class ItemListComponent extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)

    const itemsMap = new Map()
    Object.keys(this.props.items).forEach((key, index) =>
      itemsMap.set(index, this.props.items[key])
    )

    console.log(itemsMap)

    this.state = {
      itemsMap
    }
  }

  render() {
    return (
      <Container className={ this.props.className }>
        {
          Array.from(this.state.itemsMap.keys()).map(
            (key) =>
              <SortingItem
                isCorrect={ this.props.isCorrect }
                key={ key } index={ key }
                id={ this.state.itemsMap.get(key).id }
                item={ this.state.itemsMap.get(key) }
                onReorder={ this.reorder } />
          )
        }
        <PreviewItem />
      </Container>
    )
  }

  reorder(dragItem, hoverItem) {
    // Don't trigger reorder if it's to the same spot
    if (dragItem.id === hoverItem.id) {
      return
    }

    const steps = hoverItem.index - dragItem.index
    console.log(steps)

    const itemsMap = new Map(this.state.itemsMap)

    if (steps > 0) {
      itemsMap.set(dragItem.index + steps - 1, this.state.itemsMap.get(hoverItem.index))
      itemsMap.set(hoverItem.index, this.state.itemsMap.get(dragItem.index + steps - 1))
    } else {
      itemsMap.set(dragItem.index + steps + 1, this.state.itemsMap.get(hoverItem.index))
      itemsMap.set(hoverItem.index, this.state.itemsMap.get(dragItem.index + steps + 1))
    }

    console.log(`Moved ${dragItem.index} to ${hoverItem.index}`)
    console.log("After")
    console.log(itemsMap)

    this.setState({ itemsMap })
  }
}

export default DragDropContext(TouchBackend({ delayHoldTouchStart: 500 }))(ItemListComponent)
