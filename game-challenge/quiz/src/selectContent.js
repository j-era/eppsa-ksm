import keys from "lodash.keys"
import pickBy from "lodash.pickby"


export default function selectContent(data) {
  return {
    ...data.challenge,
    shared: data.shared,
    scoreCalculation: getChildren(data.challenge, "scoreCalculation")[0]
  }
}

function getChildren(parent, template) {
  return keys(pickBy(parent, child => child.template === template)).map(key => parent[key])
}
