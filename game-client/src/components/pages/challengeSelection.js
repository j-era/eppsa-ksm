import omit from "lodash.omit"
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

import { selectChallengeType } from "../../actionCreators"

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

    const { content, challengeNumber } = this.props
    this.challengeTypes = omit(content.challenges[challengeNumber].challengeTypes, "template")

    this.state = {
      names: Object.keys(this.challengeTypes),
      developmentView: false
    }
  }

  componentDidMount() {
    const challanges = new Map()

    this.state.names.forEach(challengeName => {
      const challenge = this.challengeTypes[challengeName]

      if (challanges.has(challenge.template)) {
        challanges.get(challenge.template).push(challengeName)
      } else {
        challanges.set(challenge.template, [challengeName])
      }
    })

    const challengeTypes = Array.from(challanges.keys())

    this.timeout = setTimeout(() => {
      const challengeType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)]
      const index = Math.floor(Math.random() * challanges.get(challengeType).length)
      this.selectChallengeType(challanges.get(challengeType)[index])
    }, SELECTION_TIMEOUT)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const { assetServerUri, content } = this.props
    const { developmentView, names } = this.state

    return (
      <Container>
        <PageTitle>{ content.shared.texts.challengeSelectionTitle }</PageTitle>
        {
          developmentView ?
            names.map((name) =>
              <Button key={ name } onClick={ () => this.selectChallengeType(name) }>
                { name }
              </Button>
            ) :
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

  onClick() {
    if (process.env.NODE_ENV === "development") {
      clearTimeout(this.timeout)
      this.setState({ developmentView: true })
    }
  }

  selectChallengeType(name) {
    const { content, dispatch, assetServerUri, gameServerUri, staticServerUri } = this.props
    dispatch(selectChallengeType(name, content, assetServerUri, gameServerUri, staticServerUri))
  }
}

export default withTheme(ChallengeSelection)
