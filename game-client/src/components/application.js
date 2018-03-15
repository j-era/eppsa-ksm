import React from "react"
import { connect } from "react-redux"

function Application({ content }) {
    return (
      <div>{ content.index.description }</div>
    )
}

export default connect(
  (state) => state
)(Application)
