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
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${props => props.fillColor};
`

const BackgroundArc = styled.div`
  background-color: ${props => props.fillColor};

  position: absolute;

  width: 100%;
  height: 25vw;
  top: -12.5vw;

  border-radius: 50%;

  display: flex;
  justify-content: center;
`

const Banner = styled(BannerComponent)`
  visibility: ${props => props.visible === "true" ? "visible" : "hidden"};
  
  position: absolute;

  height: 12vw;
  top: -6vw;
`


export default (props) =>
  <Container className={ props.className }>
    <BackgroundArc
      fillColor={ props.fillColor }>

      <Banner visible={ props.inGameSetup }>{ props.bannerText }</Banner>
    </BackgroundArc>
    <Background
      fillColor={ props.fillColor }>
      { props.children }
    </Background>
  </Container>
