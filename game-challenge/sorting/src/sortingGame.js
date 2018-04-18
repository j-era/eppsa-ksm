import React from "react"
import styled from "styled-components"

import pickBy from "lodash.pickby"
import mapValues from "lodash.mapvalues"

import DragDropList from "./dragDropList"

import Button from "../node_modules/eppsa-ksm-shared/styled-components/components/button"
import ButtonIcon from "../node_modules/eppsa-ksm-shared/svg/EPPSA_Assets_Button_Icon.svg"

const Container = styled.div`
  font-family: ${props => props.theme.font.fontFamily};
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: ${props => props.theme.layout.offsetX};
  padding-right: ${props => props.theme.layout.offsetX};
  padding-top: ${props => props.theme.layout.offsetY};
  padding-bottom: ${props => props.theme.layout.offsetY};
`

const TopLabel = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.layout.defaultSpacing};
`

const BottomLabel = styled.div`
  text-align: center;
`

const NextIcon = styled(ButtonIcon)`
  margin-left: 1em;
  margin-top: 0.2em;
  height: 0.9em;
  fill: black;
`

export default ({ data }) =>
  <Container>
    <TopLabel>{ data.challenge.topLabel }</TopLabel>
    <DragDropList items={ selectItems(data) } />
    <BottomLabel>{ data.challenge.bottomLabel }</BottomLabel>
    <Button onClick={ confirmSelection }>{ data.shared.texts.confirmSelection }<NextIcon /></Button>
  </Container>

function confirmSelection() {
}

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
