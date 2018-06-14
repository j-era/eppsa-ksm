import React from "react"
import styled from "styled-components"

const Container = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  
  align-items: center;
  justify-content: center;
  
  text-align: center;
  
  padding-left: 20%;
  padding-right: 20%;

`

export default () =>
  <Container>
    UPS!!
    <br />
    <br />
    <br />
    <div>
      Du hast den QR-Code gescanned aber dich nicht im WLAN angemeldet.
    </div>
    <br />
    <br />
    <br />
    <div>
      Verbinde dich mit dem WLAN
      <br />
      <b>Bretterretter</b>
      <br />
      und dem Passwort
      <br />
      <b>bretterretter</b>
      <br />
      um an der Schnitzeljagd teilzunehmen.
    </div>
  </Container>
