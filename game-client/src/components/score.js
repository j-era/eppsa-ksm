import React from "react"
import styled from "styled-components"

const ScoreContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 10vw;
  display: flex;
  justify-content: center;
  align-items: center;
  @keyframes animIncrement {
    0% {transform: translate(-100px) scale(0, 0); opacity: 0;}
    20% {transform: translate(-100px) scale(1, 1); opacity: 1;}
    40% {transform: translate(-100px) scale(1, 1); opacity: 1;}
    60% {transform: translate(0px); opacity: 1;}
    80% {transform: translate(0px) scale(1, 1); opacity: 0;}
  }

  @keyframes animOldScore {
      0% {transform: translate(100px) scale(0, 0); opacity: 0;}
      20% {transform: translate(100px) scale(1, 1); opacity: 1;}
      40% {transform: translate(100px) scale(1, 1); opacity: 1;}
      60% {transform: translate(0px); opacity: 1;}
      80% {transform: translate(0px) scale(1, 1); opacity: 0;}
  }

  @keyframes animBaz {
      0% {opacity: 0;}
      60% {opacity: 0;}
      80% {transform: translate(0px) scale(1, 1);opacity: 1;}
      100% {transform: translate(0px) scale(0, 0); opacity: 0;}
  }
`

const AnimationContainer = styled.div`
  height: 100%;
`

const ScoreIncrement = styled.div`
  position: absolute;
  top: calc((10vw - 1.2em) / 2);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.font.button.size}vw;
  background-color: blue;
  color: white;
  padding-left: 1em;
  padding-right: 1em;
  height: 1.2em;
  width: 5em;
  border-radius: ${props => props.theme.layout.borderRadius};
  animation: animIncrement 3s;
  transform: translate(-100px) scale(0, 0);
  opacity: 0;
  transition:
      transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2),
      opacity  150ms ease;
`

const OldScore = styled.div`
  position: absolute;
  top: calc((10vw - 1.2em) / 2);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.font.button.size}vw;
  background-color: red;
  color: white;
  padding-left: 1em;
  padding-right: 1em;
  height: 1.2em;
  width: 5em;
  border-radius: ${props => props.theme.layout.borderRadius};
  animation: animOldScore 3s;
  transform: translate(200px) scale(0, 0);
  opacity: 0;
  transition:
      transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2),
      opacity  150ms ease;
`

const NewScore = styled.div`
  position: absolute;
  top: calc((10vw - 1.2em) / 2);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.font.button.size}vw;
  background-color: green;
  color: white;
  padding-left: 1em;
  padding-right: 1em;
  height: 1.2em;
  width: 5em;
  border-radius: ${props => props.theme.layout.borderRadius};
  animation: animOldScore 3s;
  opacity: 0;
  transition:
      transform 150ms cubic-bezier(0.2, 0.7, 0.55, 1.2),
      opacity  150ms ease;
`

export default class Score extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.score !== prevState.score) {
      return { score: nextProps.score, diff: nextProps.score - prevState.score }
    }

    return null
  }

  constructor(props) {
    super(props)
    this.state = { score: props.score, diff: 0 }
  }

  render() {
    return (
      <ScoreContainer>
        <AnimationContainer>
          <ScoreIncrement
            key={ `${this.props.score}-increment` }
            visible={ this.state.visible }>{
              this.state.diff
            }
          </ScoreIncrement>
          <OldScore
            key={ `${this.props.score}-old` }
            visible={ this.state.visible }>{
              this.state.score - this.state.diff
            }
          </OldScore>
          <NewScore
            key={ `${this.props.score}-new` }
            visible={ this.state.visible }>{
              this.state.score
            }
          </NewScore>
        </AnimationContainer>
      </ScoreContainer>
    )
  }
}
