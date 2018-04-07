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
  render() {
    return (
      <Container items={ Object.keys(this.props.items) } className={ this.props.className }>
        {
          Object.keys(this.props.items).map((key, index) =>
            <SortingItem key={ index } item={ this.props.items[key] }/>
          )
        }
        <PreviewItem />
      </Container>
    )
  }
}

export default DragDropContext(TouchBackend({ delayHoldTouchStart: 1000 }))(ItemListComponent);
