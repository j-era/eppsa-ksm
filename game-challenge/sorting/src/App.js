import React from "react"
import { ThemeProvider } from "styled-components"
import { calculateTheme } from "eppsa-ksm-shared"

import SortingGame from "./sortingGame"

const theme = calculateTheme()

export default (props) =>
  <ThemeProvider theme={ theme }>
    <SortingGame { ...props } theme={ theme }/>
  </ThemeProvider>
