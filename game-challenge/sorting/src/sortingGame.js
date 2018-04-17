import React from "react"
import styled from "styled-components"

import pickBy from "lodash.pickby"
import mapValues from "lodash.mapvalues"

import DragDropList from "./dragDropList"

const Container = styled.div`
  height: 100vh;
`

const Label = styled.div`
  text-align: center;
  padding: 5%;
`

const ItemList = styled(DragDropList)`
  height: 80%;
`

export default ({ data }) =>
  <Container>
    <Label>{ data.topLabel }</Label>
    <ItemList items={ selectItems(data) } />
    <Label>{ data.bottomLabel }</Label>
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
