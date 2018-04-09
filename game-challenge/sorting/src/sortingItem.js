import React from "react"
import styled from "styled-components"
import { DragSource, DropTarget } from "react-dnd"
import { ItemTypes } from "./constants"

const ItemContainer = styled.div`
  height: 80px;
  background: ${props => props.isOver ? "green" : `url(${props.image})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: ${props => props.theme.borderRadius}px;
  visibility: ${props => props.isDragging ? "hidden" : "visible"};
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
      <div>
        <ItemContainer image={ this.props.item.image } { ...this.props }>
          { this.props.item.info } / { this.props.id }
        </ItemContainer>
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