import React, { Component } from 'react';
import './App.css';
import styled from "styled-components"

const Container = styled.div `
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: 100%;
  height: 100%;
`
const Button = styled.div `
  
  width: 100px;
  height: 100px;
  background-color: green;
`


class App extends Component {
  render() {
    return (
      <Container>
        <Button/>
      </Container>
    );
  }
}

export default App;
