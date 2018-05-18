import autoBind from "react-autobind"
import omit from "lodash.omit"
import omitBy from "lodash.omitby"
import React from "react"
import styled, { withTheme } from "styled-components"
import {
  Button,
  Description,
  NextButton,
  FramedIcon,
  Page,
  PageTitle
} from "eppsa-ksm-shared"

import { selectChallengeType, updateGameState } from "../../actionCreators"
import * as gameStates from "../../gameStates"

const SELECTION_TIMEOUT = 3000

const Container = styled(Page)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`
const StyledNextButton = styled(NextButton)`
  opacity: 0.3;
`

class ChallengeSelection extends React.Component {
  constructor(props) {
    super(props)

    autoBind(this)

    this.state = {
      developmentView: false
    }
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.props.dispatch(updateGameState(gameStates.CHALLENGE_MANUAL))
    }, SELECTION_TIMEOUT)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const { assetServerUri, content } = this.props
    const { developmentView } = this.state

    return (
      <Container>
        <PageTitle>{ content.shared.texts.challengeSelectionTitle }</PageTitle>
        {
          developmentView ?
            this.renderManualChallengeSelection() :
            <FramedIcon
              scale={ 0.78 }
              color={ this.props.theme.colors.area }
              iconSrc={
                `${assetServerUri}/${content.shared.assets.challengeSelectionRandom.src}` } />
        }
        <Description>{ content.shared.texts.challengeSelectionText }</Description>
        <StyledNextButton
          visible
          onClick={ () => this.onClick() }
          text={ content.shared.texts.next } />
      </Container>
    )
  }

  renderManualChallengeSelection() {
    const challenges = omitBy(
      omit(this.props.content.challenges[this.props.challengeNumber].challengeTypes, "template"),
      (challenge) => challenge.multiplayer
    )
    return (
      Object.keys(challenges).map((name) =>
        <Button key={ name } onClick={ () => this.selectChallengeType(name) }>
          { name }
        </Button>
      )
    )
  }

  selectChallengeType(name) {
    this.props.dispatch(selectChallengeType(name, this.props.content))
    this.props.dispatch(updateGameState(gameStates.CHALLENGE_MANUAL))
  }

  onClick() {
//    if (process.env.NODE_ENV === "development") {
      clearTimeout(this.timeout)
      this.setState({ developmentView: true })
//    }
  }
}
export default withTheme(ChallengeSelection)
