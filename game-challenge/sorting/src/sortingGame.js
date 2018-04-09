import React from "react"
import styled from "styled-components"

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
    <ItemList items={ data.items } />
    <Label>{ data.bottomLabel }</Label>
  </Container>
