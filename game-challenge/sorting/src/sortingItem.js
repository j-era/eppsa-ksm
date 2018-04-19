import React from "react"
import styled from "styled-components"
import { DragSource, DropTarget } from "react-dnd"
import { ItemTypes } from "./constants"
import ItemComponent from "./components/itemComponent"

const Container = styled(ItemComponent)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  background: ${props => props.isOver ? "green" : `url(${props.image.src})`};

  visibility: ${props => props.isDragging ? "hidden" : "visible"};
  margin-bottom: ${props => props.theme.layout.mediumSpacing};
`

const ItemText = styled.div`
  font-size: ${props => props.theme.font.text.size};
  padding: ${props => props.theme.layout.mediumSpacing}
`

const dragSource = {
  beginDrag(props) {
    return {
      id: props.id,
      item: props.item,
      onReorder: props.onReorder
    }
  }
}

const dropTarget = {
  drop(props, monitor) {
    const item = monitor.getItem()

    // Don't trigger reorder if it's to the same spot
    if (item.id === props.id) {
      return
    }
    item.onReorder(item.id, props.id)
  }
}

class SortingItem extends React.Component {
  render() {
    let content =
      // `div` around a styled component is required by react-dnd
      <div>
        <Container image={ this.props.item.image } { ...this.props }>
          <ItemText>{ this.props.item.text }</ItemText>
        </Container>
      </div>

    content = this.props.connectDragSource(content)
    content = this.props.connectDropTarget(content)
    content = this.props.connectDragPreview(content)

    return content
  }
}

function collectDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

function collectDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

export default DragSource(ItemTypes.SORTING_ITEM, dragSource, collectDrag)(
  DropTarget(ItemTypes.SORTING_ITEM, dropTarget, collectDrop)(SortingItem)
)
