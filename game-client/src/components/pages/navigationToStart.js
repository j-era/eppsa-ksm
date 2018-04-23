import React from "react"
import { PageTitle, StyledMarkdown } from "eppsa-ksm-shared"

export default function NavigationToStart(props) {
  return (
    <div>
      <PageTitle text={ props.content.navigationToStartTitle } />
      <StyledMarkdown>{ props.content.navigationToStartText }</StyledMarkdown>
    </div>
  )
}
