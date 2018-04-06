import React from "react"
import SortingItem from "./sortingItem"
import { DragDropContext } from "react-dnd"
import { default as TouchBackend } from "react-dnd-touch-backend";
import styled from "styled-components"

import PreviewItem from "./previewItem";

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

export default DragDropContext(TouchBackend)(ItemListComponent);
