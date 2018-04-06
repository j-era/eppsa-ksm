import React from "react"
import styled from "styled-components"

import ItemListComponent from "./itemListComponent"

const Container = styled.div`
  height: 100vh;
`

const Label = styled.div`
  text-align: center;
  padding: 5%;
`

const Items = styled(ItemListComponent)`
  height: 80%;
`

export default class SortingGame extends React.Component {
  render() {
    return (
      <Container>
        <Label>{ this.props.data.topLabel }</Label>
        <Items items={this.props.data.items} />
        <Label>{ this.props.data.bottomLabel }</Label>
      </Container>
    )
  }
}
