import React from "react"
import styled from "styled-components"

const Container = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  
  align-items: center;
  justify-content: center;
`

const Head = styled.div`
  position: relative;
  height: 20%;
  width: 100%;
  overflow: hidden;
  
  display: flex;
  align-items: center;
  justify-content: center;
`

const Arc = styled.div`
  position: absolute;
  
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  
  width: 120%;
  height: 100%;
  
  border-radius: 50%;
  
  background-color: #e5e5e5;
`

const Banner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  
  transform: translate(-50%,-50%);
  
  border-radius: 50px;
  background-color: #f5a159;
  
  font-size: 4vmax;
  color: white;
  
  padding: 0.25em 0.7em;
  
  display: flex;
  flex-direction: column;
  
  align-items: center;
  justify-content: center;
`

const Body = styled.div`
  height: 80%;
  width: 100%;
  
  background-color: #e5e5e5;
`

const Bold = styled.b` 
  font-size: 4vmax; 
  color: #f5a159;
`

const Card = styled.div`
  height: 94%;
  width: 80%;
  
  margin: auto;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  
  border-radius: 12px;
  background-color: white;
`

const Content = styled.div`
  width: 100%;
  height: 90%;
  
  max-width: 60vw;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  
  text-align: center;
  font-size: 2vmax;
`

export default () =>
  <Container>
    <Head>
      <Arc />
      <Banner>
        Bretterretter
      </Banner>
    </Head>
    <Body>
      <Card>
        <Content>
          UPS!!
          <div>
            Du hast den QR-Code gescanned aber dich nicht im WLAN angemeldet.
          </div>
          <div>
            Verbinde dich mit dem WLAN
          </div>
          <Bold>Bretterretter</Bold>
          <div>
            und dem Passwort
          </div>
          <Bold>bretterretter</Bold>
          <div>
            um an der Schnitzeljagd teilzunehmen.
          </div>
        </Content>
      </Card>
    </Body>
  </Container>
