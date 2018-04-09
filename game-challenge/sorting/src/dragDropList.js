import autoBind from "react-autobind"
import React from "react"
import { DragDropContext } from "react-dnd"
import styled from "styled-components"

import { default as TouchBackend } from "../lib/react-dnd-touch-backend/src/Touch.js";

import PreviewItem from "./previewItem";
import SortingItem from "./sortingItem"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
`

class ItemListComponent extends React.Component {
  constructor(props){
    super(props)
    autoBind(this)

    const itemsMap = new Map()
    Object.keys(this.props.items).forEach((key, index) =>
      itemsMap.set(key, this.props.items[key])
    )

    console.log(itemsMap)

    this.state = {
      itemsMap: itemsMap
    }
  }

  render() {
    return (
      <Container className={ this.props.className }>
        {
          Array.from(this.state.itemsMap.keys()).map(
            (key) => <SortingItem key={ key } id={ key } item={ this.state.itemsMap.get(key) } onReorder={ this.reorder } />
          )
        }
        <PreviewItem />
      </Container>
    )
  }

  reorder(dragItemId, hoverItemId) {
    console.log(`Dragged ${dragItemId} to ${hoverItemId}`);

    const itemsMap = new Map(this.state.itemsMap)

    itemsMap.set(dragItemId, this.state.itemsMap.get(hoverItemId))
    itemsMap.set(hoverItemId, this.state.itemsMap.get(dragItemId))

    console.log(itemsMap)

    this.setState({ itemsMap })
  }

}

export default DragDropContext(TouchBackend({ delayHoldTouchStart: 500 }))(ItemListComponent);
