import autoBind from "react-autobind"
import uniq from "lodash.uniq"
import omit from "lodash.omit"
import pickBy from "lodash.pickby"

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

    autoBind(this)

    this.challenges = omit(
      this.props.content.challenges[this.props.challengeNumber].challengeTypes,
      "template"
    )

    this.state = {
      developmentView: false
    }
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      const templates = uniq(Object.values(this.challenges).map(challenge => challenge.template))
      const randomTemplate = random(templates)

      const names = Object.keys(
        pickBy(this.challenges, challenge => challenge.template === randomTemplate)
      )
      const randomName = random(names)

      console.log(randomName)
      this.selectChallengeType(randomName)
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
            Object.keys(this.challenges).map((name) =>
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

function random(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export default withTheme(ChallengeSelection)
