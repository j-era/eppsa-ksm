import React from "react"
import styled from "styled-components"
import { DragSource, DropTarget } from "react-dnd"
import { ItemTypes } from "./constants"
import ItemComponent from "./components/itemComponent"

const Container = styled(ItemComponent)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  background: ${props => `url(${props.image.src})`};

  width: 95%;

  visibility: ${props => props.isOver  ? "hidden" : "visible"};
  margin-bottom: ${props => props.theme.layout.mediumSpacing};
`

const ItemText = styled.div`
  font-size: ${props => props.theme.font.text.size};
  padding: ${props => props.theme.layout.mediumSpacing}
`

const dragSource = {
  beginDrag(props) {
    console.log(props)
    return {
      id: props.id,
      item: props.item,
      index: props.index,
      onReorder: props.onReorder
    }
  }
}

const dropTarget = {
  hover(props, monitor) {
    const dragItem = monitor.getItem()
    const dropItem = props

    dragItem.onReorder(dragItem, dropItem)
  }
}

class SortingItem extends React.Component {
  render() {
    let content =
      // `div` around a styled component is required by react-dnd
      <div style={ { "display": "flex", "justifyContent": "center" } }>
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
