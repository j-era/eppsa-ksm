import React from "react"
import styled from "styled-components"

const Banner = styled.div`
  position: absolute;
  visibility: ${props => props.show === "true" ? "visible" : "hidden"};
  
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  
  left: 0;
  right: 0;
  
  margin-left: auto;
  margin-right: auto;
  
  width: 50vw;
  
  color: white;
  
  font-family: ${props => props.theme.font.fontFamily};
  font-size: ${props => props.theme.font.headline.size};
  font-weight: ${props => props.theme.font.headline.weight};
    
  background-color: ${props => props.theme.colors.primary};
  
  border-radius: ${props => props.theme.layout.borderRadius};
  
  display: flex;
  justify-content: center;
  align-items: center;
`

export default props =>
  <Banner className={ props.className } show={ props.show }>
    { props.bannerText }
  </Banner>
