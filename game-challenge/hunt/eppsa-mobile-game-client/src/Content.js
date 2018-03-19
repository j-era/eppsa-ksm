import mapValues from "lodash/mapValues"
import omit from "lodash/omit"
import keys from "lodash/keys"
import axios from "axios"

class Content {
  constructor() {
    this.data = {}
  }

  async loadCmsData(gitJsonApi) {
    const cmsData = await axios.get(`${gitJsonApi}`)
    this.data.game = transform(cmsData.data)
  }

  selectPlayerContent(playerId) {
    const player = this.data.game.players[`player-${playerId + 1}`]
    const playerQuestIds = player.quests.split(",").map(val => val.trim())
    const playerQuests = playerQuestIds.reduce((obj, questId) => {
      const out = {
        ...obj,
        [questId]: this.data.game.quests[questId]
      }
      out[questId].items = out[questId].items.split(",").map(val => val.trim())
      return out
    }, {})
    const playerQuestItemIds = playerQuestIds
      .map(questId => this.data.game.quests[questId].items)
      .reduce((a, b) => a.concat(b), [])

    return {
      player,
      playerQuests,
      playerQuestIds,
      playerQuestItemIds
    }
  }

  selectSharedContent() {
    const items = mapValues(this.data.game.items, (item, itemId) => (
      {
        name: item.name,
        iconSrc: item.icon.src,
        description: item.description,
        questId: this.getQuestId(itemId)
      }
    ))

    return {
      name: this.data.game.name,
      description: this.data.game.description,
      items
    }
  }

  getQuestId(itemId) {
    const [questId] = Object.keys(this.data.game.quests).filter(questId =>
      this.data.game.quests[questId].items.includes(itemId)
    )

    return questId
  }
}

export default new Content()

function transform(content) {
  const result = omit(content.index, "template")
  keys(omit(content, "index")).forEach(key => {
    result[key] = transform(content[key])
  })
  return result
}
