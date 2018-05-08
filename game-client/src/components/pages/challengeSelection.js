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
    this.names = Object.keys(this.challengeTypes)

    this.state = {
      developmentView: false
    }
  }

  componentDidMount() {
    const challangeMap = new Map()

    this.names.forEach(challengeName => {
      const challenge = this.challengeTypes[challengeName]

      if (challangeMap.has(challenge.template)) {
        challangeMap.get(challenge.template).push(challengeName)
      } else {
        challangeMap.set(challenge.template, [challengeName])
      }
    })

    const challengeTypes = Array.from(challangeMap.keys())

    this.timeout = setTimeout(() => {
      const challengeType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)]
      const index = Math.floor(Math.random() * challangeMap.get(challengeType).length)
      this.selectChallengeType(challangeMap.get(challengeType)[index])
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
            this.names.map((name) =>
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
