import transition from "styled-transition-group"

const FADE_TIME = 500

export default transition.div.attrs({
  unmountOnExit: true,
  timeout: FADE_TIME * 2
})`
  &:enter {
    opacity: 0;
  }
  &:enter-active {
    opacity: 1;
    transition: opacity ${FADE_TIME}ms ease ${FADE_TIME}ms;
  }
  &:exit {
    opacity: 1;
  }
  &:exit-active {
    opacity: 0;
    transition: opacity ${FADE_TIME}ms ease;
  }
`
