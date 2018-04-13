export default function selectContent(data, challengeNumber) {
  const station = data.challenges[challengeNumber]
  const challenge = data.challenges[challengeNumber].challengeTypes.quiz

  return {
    challenge,
    color: station.color,
    shared: data.shared,
  }
}
