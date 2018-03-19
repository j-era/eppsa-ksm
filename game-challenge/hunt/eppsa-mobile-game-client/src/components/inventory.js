import React from "react"
import styled from "styled-components"

import ItemSlot from "./itemSlot"

export const Container = styled.div`
  display: flex;
  
  justify-content: space-around;
  align-items: center;
  
  height: 100%;
`

const Icon = styled.div`
  background-image: url(${props => props.image});
  background-position: center;
  background-size: cover;
  width: 100%;
  height:100%;
  border-radius: 50%;
`

export const Quest = styled.div`
  text-overflow: ellipsis;
  opacity: 0.5;
  white-space: nowrap;
  overflow: scroll;
`

export default ({ content, inventory, onSlotSelect, quests, selectedQuestId, selectedItemId }) => {
  const { items } = content.selectSharedContent()

  const entries = Object.entries(inventory)

  return (
    <Container>
      { entries.map(entry => {
        const [questId, itemId] = entry

        return (
          <ItemSlot
            key={ questId }
            isItemSelected={ selectedItemId !== null && selectedItemId === itemId }
            isQuestSelected={ selectedQuestId !== null && selectedQuestId === questId }
            onClick={ () => onSlotSelect(questId, itemId) }>
            {
              itemId &&
              <Icon
                image={ `https://${window.location.hostname}/assets/${items[itemId].iconSrc}` } />
              ||
              <Quest>{ quests[questId].name }</Quest>
            }
          </ItemSlot>
        )
      })}
    </Container>
  )
}
