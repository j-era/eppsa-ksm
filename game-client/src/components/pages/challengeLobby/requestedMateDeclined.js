import React from "react"
import autoBind from "react-autobind"
import styled, { withTheme } from "styled-components"

import {
  Button,
  delay,
  FramedIcon,
  Page,
  PageTitle
} from "eppsa-ksm-shared"

import { cancelRequestMate } from "../../../actionCreators"

const Container = styled(Page)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const StyledPageTitle = styled(PageTitle)`
  height: 1em;
`

const CancelButton = styled(Button)`
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  border-color: ${props => props.theme.colors.secondary};
`

class RequestedMateDeclined extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { cancelClicked: false }
  }

  render() {
    const { assetServerUri, connectedGames, content, requestedMate } = this.props
    const title = content.shared.texts.requestedMateDeclinedTitle
      .replace(/\${mate}/g, requestedMate.name)

    return (
      <Container>
        <StyledPageTitle>{ title }</StyledPageTitle>
        <FramedIcon
          scale={0.78}
          color={ this.props.theme.colors.area }
          iconSrc={ `${assetServerUri}/${content.shared.assets.lobbyIconError.src}` } />
        <CancelButton
          onClick={ this.cancel }
          clicked={ this.state.cancelClicked }>
          { content.shared.texts.requestedMateDeclinedCancelButton }
        </CancelButton>
      </Container>
    )
  }

  async cancel() {
    this.setState({ cancelClicked: true })
    await delay(100)
    this.props.dispatch(cancelRequestMate(this.props.gameServer))
  }
}

export default withTheme(RequestedMateDeclined)
