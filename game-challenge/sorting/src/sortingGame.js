import React from "react"
import styled from "styled-components"

import pickBy from "lodash.pickby"
import mapValues from "lodash.mapvalues"

import DragDropList from "./dragDropList"

const Container = styled.div`
  background-color: white;
`

const TopLabel = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.layout.mediumSpacing};
`

const BottomLabel = styled.div`
  text-align: center;
`

export default ({ data }) =>
  <Container>
    <TopLabel>{ data.challenge.topLabel }</TopLabel>
    <DragDropList items={ selectItems(data) } />
    <BottomLabel>{ data.challenge.bottomLabel }</BottomLabel>
  </Container>

function selectItems(data) {
  const items = pickBy(data.challenge, (object) => object.template === "sortingItem")
  return mapValues(items, (item) =>
    Object.assign(item, {
      image: {
        src: `${data.assetServerUri}/${item.image.src}`
      }
    })
  )
}
