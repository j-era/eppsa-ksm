import React from "react"
import { ThemeProvider } from "styled-components"
import SortingGame from "./sortingGame"
import theme from "../node_modules/eppsa-ksm-shared/styled-components/theme"

export default ({ data }) =>
  <ThemeProvider theme={ theme }>
    <SortingGame data={ data } />
  </ThemeProvider>
