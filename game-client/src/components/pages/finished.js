import React from "react"
import styled from "styled-components"
import { Button, PageTitle, Page, StyledMarkdown } from "eppsa-ksm-shared"

const Container = styled(Page)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const TopText = styled(StyledMarkdown)`
  display:flex;
  text-align: center;
  flex-direction: column;  
  color: ${props => props.theme.font.headline.color};
  font-weight: ${props => props.theme.font.headline.weight};
`

const ScoreContainer = styled.div`
  display:flex;
  flex-direction: column;  
  text-align: center;
`

const ScoreText = styled.div`
  text-align: center;
  font-size: ${props => props.theme.font.text.size}vw;
  font-weight: ${props => props.theme.font.headline.weight};
  color: ${props => props.theme.font.headline.color};
  margin-bottom: 1em;
`

const BottomText = styled(StyledMarkdown)`
  display:flex;
  text-align: center;
  flex-direction: column;
`

export default function Finished({ content, score }) {
  return (
    <Container>
      <PageTitle>{ content.shared.texts.finishTitle }</PageTitle>
      <TopText>{ content.shared.texts.finishTopText }</TopText>
      <ScoreContainer>
        <ScoreText>{ content.shared.texts.finishScoreText }</ScoreText>
        <Button>{ score }</Button>
      </ScoreContainer>
      <BottomText>{ content.shared.texts.finishBottomText }</BottomText>
    </Container>
  )
}
