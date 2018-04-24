import React from "react"
import omit from "lodash.omit"

import { selectChallengeType } from "../../actionCreators"
import { CHALLENGE_MANUAL } from "../../gameStates"

export default class ChallengeSelection extends React.Component {
  constructor(props) {
    super(props)
    // this.state = { showResult: false }
    // this.timeout = setTimeout(() => this.setState({ showResult: true }), 2000);
    
    // this.props.dispatch(selectChallenge())
  }

  componentWillUnmount() {
    // clearTimeout(this.timeout)
  }

  render() {
    const { content, challengeNumber } = this.props
    const challengeTypes = content.challenges[challengeNumber].challengeTypes
    
    return (
      <div>
        <div>{ content.challengeSelectionText }</div>
        {
          Object.keys(omit(challengeTypes, "template")).map((name) => this.renderChallengeType(name))
        }
      </div>
    )
  }
 
  renderChallengeType(name) {
    const { content, dispatch, assetServerUri, gameServerUri, staticServerUri } = this.props
    return (
      <button key={ name } onClick={ () =>
        dispatch(selectChallengeType(name, content, assetServerUri, gameServerUri, staticServerUri))}>
        { name }
      </button>
    )
  }
}

