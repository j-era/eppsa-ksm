import React from "react"
import styled from "styled-components"

const Container = styled.div`
  height: 100%;

  display: flex;
  
  align-items: center;
  justify-content: center;
`

const Content = styled.div`
  height: 100%;
  
  max-height: 450px;
  max-width: 200px;
  
  display: flex;
  flex-direction: column;
  
  align-items: center;
  justify-content: space-evenly;
  
  text-align: center;
`

const Bold = styled.b`
  font-size: 25px;
`

export default () =>
  <Container>
    <Content>
      UPS!!
      <div>
        Du hast den QR-Code gescanned aber dich nicht im WLAN angemeldet.
      </div>
      <div>
        Verbinde dich mit dem WLAN
      </div>
      <Bold> Bretterretter</Bold>
      <div>
        und dem Passwort
      </div>
      <Bold> bretterretter</Bold>
      <div>
        um an der Schnitzeljagd teilzunehmen.
      </div>
    </Content>
  </Container>
