import React from "react"
import autoBind from "react-autobind"
import styled, { withTheme } from "styled-components"

import {
  Button,
  delay,
  FramedIcon,
  NextButton,
  Page,
  PageTitle
} from "eppsa-ksm-shared"

import { acceptMate, declineMate } from "../../../actionCreators"

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

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
`

const AcceptButton = styled(NextButton)`
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
`

const DeclineButton = styled(Button)`
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  border-color: ${props => props.theme.colors.secondary};
`

class MateRequestPending extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { acceptClicked: false, declineClicked: false }
  }

  render() {
    const { assetServerUri, connectedGames, content, mateRequest } = this.props
    const { name } = connectedGames.find(({ gameId }) => mateRequest === gameId)
    const title = content.shared.texts.mateRequestPendingTitle.replace(/\${mate}/g, name)

    return (
      <Container>
        <PageTitle>{ title }</PageTitle>
        <Content>
          <FramedIcon
            scale={ 0.78 }
            color={ this.props.theme.colors.area }
            iconSrc={ `${assetServerUri}/${content.shared.assets.skillIcon.src}` } />
          <Buttons>
            <AcceptButton
              visible
              onClick={ this.accept }
              clicked={ this.state.acceptClicked }
              text={ content.shared.texts.mateRequestPendingAcceptButton } />
            <DeclineButton
              onClick={ this.decline }
              clicked={ this.state.declineClicked }>
              { content.shared.texts.mateRequestPendingDeclineButton }
            </DeclineButton>
          </Buttons>
        </Content>
      </Container>
    )
  }

  async accept() {
    const { dispatch, gameServer, mateRequest } = this.props

    this.setState({ acceptClicked: true })
    await delay(100)
    dispatch(acceptMate(mateRequest, gameServer))
  }

  async decline() {
    const { dispatch, gameServer, mateRequest } = this.props

    this.setState({ declineClicked: true })
    await delay(100)
    dispatch(declineMate(mateRequest, gameServer))
  }
}

export default withTheme(MateRequestPending)
