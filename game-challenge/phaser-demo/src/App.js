import React, { Component } from "react"

import { ThemeProvider } from "styled-components"
import PhaserDemo from "./phaserDemo"

const theme = {
  gapHeight: 5,
  borderRadius: 15
}

class App extends Component {
  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <PhaserDemo />
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
