import React from "react"
import styled from "styled-components"

import banner from "../../node_modules/eppsa-ksm-shared/svg/SVG_Assets_180321_Button_Small_Background.svg"

const Banner = styled.div`
  position: absolute;
  visibility: ${props => props.show === "true" ? "visible" : "hidden"};
  
  left: 0;
  right: 0;
  
  margin-left: auto;
  margin-right: auto;
  
  width: 50vw;
  height: ${bannerTextHeight(window.innerWidth * 0.5)}px;
  
  color: white;
  
  font-family: ${props => props.theme.font.fontFamily};
  font-size: ${props => props.theme.font.headline.size};
  font-weight: ${props => props.theme.font.headline.weight};
  
  display: flex;
  justify-content: center;
  align-items: center;
`

const BannerSVG = styled(banner)`
  visibility: inherit;
  position: inherit;

  left: 0;
  right: 0;
  
  fill: ${props => props.theme.colors.primary};
`

const TextContainer = styled.div`
  position: relative;
`

function bannerTextHeight(width) {
  return width * 0.205466666666667
}

export default props =>
  <Banner className={ props.className } show={ props.show }>
    <BannerSVG />
    <TextContainer>{ props.bannerText }</TextContainer>
  </Banner>
