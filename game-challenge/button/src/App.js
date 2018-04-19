import React, { Component } from "react"
import "./App.css"
import styled from "styled-components"
import QrReader from "react-qr-reader"

const Container = styled.div `
  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;

  width: 100%;
  height: 100%;
`
const ButtonDiv = styled.div `

  width: 100px;
  height: 100px;
  background-color: green;
`

class Button extends Component {
  constructor(props) {
    super(props)

    this.contentServerUri = props.contentServerUri
    this.assetServerUri = props.assetServerUri
    this.gameServerUri = props.gameServerUri

    this.state = {
      scanned: "nothing scanned yet",
      onClick: props.onClick
    }
  }

  render() {
    return (
      <Container>
        <QrReader
          onScan={ data => this.onScan(data) }
          onError={ err => this.onError(err) }
          showViewFinder={ false }
          style={ { width: "50%" } } />
        <div>{ this.state.scanned }</div>
        <div>sessionLength: { this.props.sessionLength }</div>
        <ButtonDiv className={ "button" } onClick={ this.state.onClick } />
        <div>contentServerUri: { this.contentServerUri }</div>
        <div>assetServerUri: { this.assetServerUri }</div>
        <div>gameServerUri: { this.gameServerUri }</div>
        { this.props.orientation && this.renderOrientationValues() }
      </Container>
    )
  }

  renderOrientationValues() {
    return (
      <div>
        <div>alpha: { this.props.orientation.alpha }</div>
        <div>beta: { this.props.orientation.beta }</div>
        <div>gamma: { this.props.orientation.gamma }</div>
      </div>
    )
  }

  onScan(data) {
    if (data) {
      this.setState({
        scanned: data
      })
      console.log(data)
    }
  }

  onError(err) {
    console.error(err)
  }
}

export default Button
