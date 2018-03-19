import React from "react"
import styled from "styled-components"

import OkIconSvg from "../svg/icon-ok.svg"

export const Container = styled.div`
  display: flex;
  
  justify-content: center;
  align-items: center;
  
  padding: 10px;
  
  border-top: 1px solid;  
`

const Text = styled.div`

`

const ButtonContainer = styled.div`
  display: flex;
`

const OkButton = styled(OkIconSvg)`
  width: 20vw;
  height: 20vw;
`

export default ({ onOk }) =>
  <Container>
    <Text>You've completed all your quests. Notify your teammate?</Text>
    <ButtonContainer>
      <OkButton onClick={ onOk } />
    </ButtonContainer>
  </Container>
