import React from "react"
import { ThemeProvider } from "styled-components"
import { theme } from "eppsa-ksm-shared"

import SortingGame from "./sortingGame"

export default (props) =>
  <ThemeProvider theme={ theme }>
    <SortingGame { ...props } />
  </ThemeProvider>
