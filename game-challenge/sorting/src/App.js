import React from "react"

import { ThemeProvider } from "styled-components"
import SortingGame from "./sortingGame"

const theme = {
  gapHeight: 5,
  borderRadius: 15
}

export default ({ data }) =>
  <ThemeProvider theme={ theme }>
    <SortingGame data={ data } />
  </ThemeProvider>
