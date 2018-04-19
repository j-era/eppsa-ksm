import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"

import pickBy from "lodash.pickby"
import mapValues from "lodash.mapvalues"

import DragDropList from "./dragDropList"

import Button from "../node_modules/eppsa-ksm-shared/styled-components/components/button"
import ButtonIcon from "../node_modules/eppsa-ksm-shared/svg/EPPSA_Assets_Button_Icon.svg"


const Container = styled.div`
  font-family: ${props => props.theme.font.fontFamily};

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const NextIcon = styled(ButtonIcon)`
  margin-left: 1em;
  margin-top: 0.2em;
  height: 0.9em;
  fill: black;
`

const TopLabel = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.layout.mediumSpacing};
`

const BottomLabel = styled.div`
  text-align: center;
`

export default class SortingGame extends React.Component {
  constructor(props) {
    super(props)

    autoBind(this)

    this.items = selectItems(this.props.data)

    this.state = {
      isCorrect: false
    }
  }

  render() {
    return (
      <Container>
        <div>
          <TopLabel>{ this.props.data.challenge.topLabel }</TopLabel>
          <DragDropList items={ this.items } isCorrect={ this.state.isCorrect } />
          <BottomLabel>{ this.props.data.challenge.bottomLabel }</BottomLabel>
        </div>
        <Button onClick={ this.confirmSelection }>
          { this.props.data.shared.texts.confirmSelection }<NextIcon />
        </Button>
      </Container>
    )
  }

  confirmSelection() {
    console.log("confirmSelection")
    this.setState({
      isCorrect: true
    })
  }
}

function selectItems(data) {
  const items = pickBy(data.challenge, (object) => object.template === "sortingItem")
  return mapValues(items, (item) =>
    Object.assign(item, {
      image: {
        src: `${data.assetServerUri}/${item.image.src}`
      },
      id: `item${item.correctPosition}`
    })
  )
}
