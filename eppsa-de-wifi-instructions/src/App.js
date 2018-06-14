import React from "react"
import styled from "styled-components"

const Container = styled.div`
  height: 100%;

  display: flex;
  
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
    <br />
    Du hast den QR-Code gescanned aber dich nicht im WLAN angemeldet.
    <br />
    <br />
    <br />
    <br />
    Verbinde dich mit den WLAN {"<SSID>"} dem dem Passwort
    {"<PW>"}, um an der Schnitzeljagd teilzunehmen.
  </Container>
