import React from "react"
import { NextButton, PageTitle, StyledMarkdown } from "eppsa-ksm-shared"

import { showGameManual } from "../../actionCreators"

export default function gameManual(props) {
  return (
    <div>
      <PageTitle text={ props.content.gameManualTitle } />
      <StyledMarkdown>{ props.content.gameManualText }</StyledMarkdown>
      <NextButton
        visible
        onClick={ () => props.dispatch(showGameManual(false)) }
        text="Ok" />
    </div>
  )
}
