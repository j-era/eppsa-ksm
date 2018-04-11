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
    this.challengeNumber = props.challengeNumber

    this.state = {
      scanned: "nothing scanned yet",
      onClick: props.onClick
    }
  }

  render() {
    const orientation = this.props.orientation !== undefined
    ? this.props.orientation
    : { x: "undefined", y: "undefined"}
    return (
      <Container>
        <QrReader
          onScan={ data => this.onScan(data) }
          onError={ err => this.onError(err) }
          style={ { width: "50%" } } />
        <div>{ this.state.scanned }</div>
        <ButtonDiv className={ "button" } onClick={ this.state.onClick } />
        <div>contentServerUri: { this.contentServerUri }</div>
        <div>assetServerUri: { this.assetServerUri }</div>
        <div>gameServerUri: { this.gameServerUri }</div>
        <div>challengeNumber: { this.challengeNumber }</div>
        <div>x: { Math.round(orientation.x) }, y: { Math.round(orientation.y) }</div>
      </Container>
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
