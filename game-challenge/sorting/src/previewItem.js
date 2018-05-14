import React from "react"
import { DragLayer } from "react-dnd"
import styled from "styled-components"
import ItemComponent from "./components/itemComponent"

const Container = styled(ItemComponent)`
  position: absolute;
  top: 0;
  left: ${props => props.theme.layout.cardPaddingVertical};

  background-image: ${props => `url(${props.item.image.src})`};

  width: calc(100% - ${props => props.theme.layout.cardPaddingVertical} * 2);
`

const ItemText = styled.div`
  color: ${props => props.color};
  font-size: ${props => props.theme.font.headline.size}vw;

  text-align: center;
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

  const y = currentOffset.y
  const transform = `translate(0px, ${y}px)`

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
      <Container item={ this.props.item } style={ getItemStyles(this.props.currentOffset) } >
        <ItemText color={ this.props.item.color }>{ this.props.item.text }</ItemText>
      </Container>
    )
  }
}

export default DragLayer(collect)(PreviewItem)
