import React, { Component } from 'react'
import './App.css';
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
  constructor(props){
    super(props)
    this.state = {
      scanned: "nothing scanned yet",
      onClick: props.onClick
    }
  }

  render(){
    return(
      <Container>
        <QrReader
          onScan={ data => this.onScan(data) }
          onError={ err => this.onError(err) }
          style={{ width: '50%' }}
        />
        <div>{ this.state.scanned }</div>
        <ButtonDiv onClick={ this.state.onClick }/>
      </Container>
    )
  }

  onScan(data){
    if(data){
      this.setState({
        scanned: data
      })
      console.log(data)
    }
  }

  onError(err){
    console.error(err)
  }
}

export default Button
