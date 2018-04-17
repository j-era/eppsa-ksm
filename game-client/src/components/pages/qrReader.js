import React from "react"
import ReactQrReader from "react-qr-reader"

import { handleChallengeQrCode, handleQrReaderError } from "../../actionCreators"

export default function QrReader({ challengeNumber, content, dispatch }) {
  const challenge = content.challenges[challengeNumber]

  return (
    <div>
      <ReactQrReader
        style={ { width: "200px", height: "200px" } }
        onScan={ (data) => dispatch(handleChallengeQrCode(data, challenge)) }
        onError={ (error) => dispatch(handleQrReaderError(error)) }
        showViewFinder={ false } />
      <button onClick={ () => dispatch(handleChallengeQrCode(challenge.token, challenge)) }>
        Start Challenge
      </button>
    </div>
  )
}
