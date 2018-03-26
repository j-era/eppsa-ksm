import { keys, pickBy } from "lodash"


export default function selectContent(data) {
  return {
    ...data,
    answers: getChildren(data, "quizAnswer")
  }
}

function getChildren(parent, template) {
  return keys(pickBy(parent, child => child.template === template)).map(key => parent[key])
}
