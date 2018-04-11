import React from "react"

export default function Finished(props) {
  return (
    <div>
      <div>{ props.content.finishText }</div>
      <div>Score: { props.score }</div>
    </div>
  )
}