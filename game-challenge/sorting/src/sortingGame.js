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

export default class SortingGame extends React.Component {
  render() {
    return (
      <Container>
        <Label>{ this.props.data.topLabel }</Label>
        <ItemList items={this.props.data.items} />
        <Label>{ this.props.data.bottomLabel }</Label>
      </Container>
    )
  }
}
