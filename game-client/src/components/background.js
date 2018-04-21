import React from "react"
import styled from "styled-components"

import BannerComponent from "./banner"

const Container = styled.div`
  position: relative;
  width: 100%;
  
  background-color: white;
`

const Background = styled.div`
  position: relative;
  width: 100%;
  height: inherit;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  background-color: ${props => props.fillColor};
`

const BackgroundArc = styled.div`
  background-color: ${props => props.fillColor};
  
  position: absolute;
  
  top: -12.5vw;

  width: 100%;
  height: 25vw;
  
  border-radius: 50%;
`

const Banner = styled(BannerComponent)`
  top: -16vw;
`


export default (props) =>
  <Container className={ props.className }>
    <BackgroundArc
      fillColor={ props.fillColor } />
    <Banner
      show={ props.inGameSetup }
      bannerText={ props.bannerText } />
    <Background
      fillColor={ props.fillColor }>
      { props.children }
    </Background>
  </Container>
