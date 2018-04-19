import React from "react"
import styled, { ThemeProvider } from "styled-components"
import SortingGame from "./sortingGame"

import Button from "../node_modules/eppsa-ksm-shared/styled-components/components/button"
import theme from "../node_modules/eppsa-ksm-shared/styled-components/theme"
import ButtonIcon from "../node_modules/eppsa-ksm-shared/svg/EPPSA_Assets_Button_Icon.svg"

const Container = styled.div`
  font-family: ${props => props.theme.font.fontFamily};

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const NextIcon = styled(ButtonIcon)`
  margin-left: 1em;
  margin-top: 0.2em;
  height: 0.9em;
  fill: black;
`
export default ({ data }) =>
  <ThemeProvider theme={ theme }>
    <Container>
      <SortingGame data={ data } />
      <Button onClick={ confirmSelection }>
        { data.shared.texts.confirmSelection }<NextIcon />
      </Button>
    </Container>
  </ThemeProvider>

function confirmSelection() {
}
