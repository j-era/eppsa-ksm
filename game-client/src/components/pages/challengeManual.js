import React from "react"
import autoBind from "react-autobind"
import styled, { withTheme } from "styled-components"
import { delay, Description, FramedIcon, NextButton, Page, PageTitle } from "eppsa-ksm-shared"

import { selectChallengeMode } from "../../actionCreators"
import { CHALLENGE_SELECTION } from "../../gameStates"

const Container = styled(Page)`
  display: flex;
  flex-direction: column;
`

const Content = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

class ChallengeManual extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { nextClicked: false }
  }
  
  render() {
    const { assetServerUri, challengeData, content, theme } = this.props

    const name = challengeData.challenge.name
    const icon = content.shared.assets[`${challengeData.challenge.template}Icon`]
    const description = challengeData.challenge.manualText

    return (
      <Container>
        <PageTitle text={ name } />
        <Content>
          <FramedIcon
            color={ theme.colors.area }
            iconSrc={ `${assetServerUri}/${icon.src}` } />
          <Description>
            { description }
          </Description>
          <NextButton
            visible
            clicked={ this.state.nextClicked }
            onClick={ this.onNext }
            text={ content.shared.texts.next } />
        </Content>
      </Container>
    )
  }

  async onNext() {
    this.setState({ nextClicked: true })
    await delay(100)
    this.props.dispatch(selectChallengeMode(this.props.content, this.props.gameServer))
  }
}

export default withTheme(ChallengeManual)
