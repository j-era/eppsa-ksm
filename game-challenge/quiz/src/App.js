import React from "react"
import "./App.css"
import styled from "styled-components"

const Container = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  width: 100%;
  height: 100%;
`
const Button = styled.div `
  margin-top: 5px;
  width: 200px;
  height: 100px;
  background-color: green;
`

export default props =>
  <Container>
    {
      props.config.answers.map((answer, i) =>
        <Button key={ i }>{ answer.answer }</Button>
      )
    }
    <Button onClick={ props.onClick }>Confirm</Button>
  </Container>
