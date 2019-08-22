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

const Score = styled(Button)`
  pointer-events: none;
`

export default function Finished({ content, score, playerType }) {
  return (
    <Container>
      <PageTitle>{ content.shared.texts.finishTitle }</PageTitle>
      <TopText>{ content[playerType].finishTopText }</TopText>
      <ScoreContainer>
        <ScoreText>{ content.shared.texts.finishScoreText }</ScoreText>
        <Score>{ score }</Score>
      </ScoreContainer>
      <BottomText>{ content[playerType].finishBottomText }</BottomText>
    </Container>
  )
}
