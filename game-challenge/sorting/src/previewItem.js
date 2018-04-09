import React from "react"
import { DragLayer } from "react-dnd"
import styled from "styled-components"

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  background: ${props => `url(${props.item.image})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: ${props => props.theme.borderRadius}px;

  border: 5px solid black;
  height: 80px;
  width: 100%;
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

const PreviewItem = (props) => {
  if (!props.isDragging) {
    return null
  }

  return (
    <Container item={ props.item } style={ getItemStyles(props.currentOffset) } />
  )
}

export default DragLayer(collect)(PreviewItem)
