import React from "react"
import { DragDropContext } from "react-dnd"
import FlipMove from "react-flip-move"

import { default as TouchBackend } from "./Touch"

import PreviewItem from "./previewItem"
import SortingItem from "./sortingItem"

class DragDropList extends React.Component {
  render() {
    return (
      <div>
        <FlipMove
          duration={ 2000 }
          easing="ease-out"
          disableAllAnimations={ !this.props.isConfirmed }>
          {
            this.props.items.map((item) =>
              <SortingItem
                isConfirmed={ this.props.isConfirmed }
                isCorrect={ this.props.isCorrect }
                isWrong={ this.props.isWrong }
                key={ item.id }
                item={ item }
                onReorder={ this.props.reorder } />
            )
          }
        </FlipMove>
        <PreviewItem />
      </div>
    )
  }
}

export default DragDropContext(TouchBackend({ delayHoldTouchStart: 0 }))(DragDropList)
