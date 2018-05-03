import React from "react"
import styled from "styled-components"

const ScoreContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 10vw;
  display: flex;
  justify-content: center;
  align-items: center;
  @keyframes animOldScore {
    0% {transform: translate(-7.5em) scale(0, 0); opacity: 0;}
    20% {transform: translate(-7.5em) scale(1, 1); opacity: 1;}
    40% {transform: translate(-7.5em) scale(1, 1); opacity: 1;}
    60% {transform: translate(-2.5em); opacity: 1;}
    80% {transform: translate(-2.5em) scale(1, 1); opacity: 0;}
  }

  @keyframes animIncrement {
      0% {transform: translate(2.5em) scale(0, 0); opacity: 0;}
      20% {transform: translate(2.5em) scale(1, 1); opacity: 1;}
      40% {transform: translate(2.5em) scale(1, 1); opacity: 1;}
      60% {transform: translate(-2.5em); opacity: 1;}
      80% {transform: translate(-2.5em) scale(1, 1); opacity: 0;}
  }

  @keyframes animNewScore {
      0% {transform: translate(-2.5em); opacity: 0;}
      60% {transform: translate(-2.5em); opacity: 0;}
      80% {transform: translate(-2.5em) scale(1, 1); opacity: 1;}
      100% {transform: translate(-2.5em) scale(0, 0); opacity: 0;}
  }
`

const AnimationContainer = styled.div`
  height: 100%;
`

const ScoreElement = styled.div`
  position: absolute;
  box-sizing: border-box;
  top: calc((10vw - 1.2em) / 2);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.font.button.size}vw;
  padding-left: 1em;
  padding-right: 1em;
  height: 1.2em;
  width: 5em;
  border-radius: ${props => props.theme.layout.borderRadius};
  transition:
      transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2),
      opacity  150ms ease;
`

const ScoreIncrement = styled(ScoreElement)`
  color: black;
  background-color: white;
  animation: ${props => props.show ? "animIncrement 3s;" : ";"}
  transform: translate(2.5em) scale(0, 0);
  opacity: 0;
`

const OldScore = styled(ScoreElement)`
  color: white;
  background-color: ${props => props.theme.colors.area};
  animation: ${props => props.show ? "animOldScore 3s;" : ";"}
  transform: translate(2.5em) scale(0, 0);
  opacity: 0;
  transition:
      transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2),
      opacity  150ms ease;
`

const NewScore = styled(ScoreElement)`
  color: white;
  background-color: ${props => props.theme.colors.area};
  animation: ${props => props.show ? "animNewScore 3s;" : ";"}
  transform: translate(-2.5em);
  opacity: 0;
  transition:
      transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2),
      opacity  150ms ease;
`

export default class Score extends React.Component {
  constructor(props) {
    super(props)
    this.state = { oldScore: 0 }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === this.props.show) {
      this.setState({
        oldScore: this.props.score
      })
    }
  }

  render() {
    const { show } = this.props
    return (
      <ScoreContainer>
        <AnimationContainer>
          <ScoreIncrement show={ show }>
            + {
              this.props.score - this.state.oldScore
            }
          </ScoreIncrement>
          <OldScore show={ show }>
            {
              this.state.oldScore
            }
          </OldScore>
          <NewScore show={ show }>
            {
              this.props.score
            }
          </NewScore>
        </AnimationContainer>
      </ScoreContainer>
    )
  }
}
