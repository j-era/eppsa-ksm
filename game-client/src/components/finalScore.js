import React from "react"

export default function FinalScore({ text, score }) {
  return (
    <div> 
      <div>{ text }</div>
      <div>Score: { score }</div>
    </div>
  )
}
