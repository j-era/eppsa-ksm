import React from "react"
import { DragLayer } from "react-dnd"
import styled from "styled-components"
import ItemComponent from "./components/itemComponent"

const Container = styled(ItemComponent)`
  position: absolute;
  top: 0;
  left: 0;

  background: ${props => `url(${props.item.image.src})`};

  width: ${props => `calc(100vw - ${props.theme.layout.offsetX} * 2)`};

  border: 5px solid black;
`

function collect(monitor) {
  const item = monitor.getItem()
  return {
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
    item: item && item.item
  }
}

function getItemStyles(currentOffset) {
  if (!currentOffset) {
    return {
      display: "none"
    }
  }

  // http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
  const x = currentOffset.x
  const y = currentOffset.y
  const transform = `translate(${x}px, ${y}px)`

  return {
    pointerEvents: "none",
    transform
  }
}

class PreviewItem extends React.Component {
  render() {
    if (!this.props.isDragging) {
      return null
    }

    return (
      <Container item={ this.props.item } style={ getItemStyles(this.props.currentOffset) } />
    )
  }
}

export default DragLayer(collect)(PreviewItem)
