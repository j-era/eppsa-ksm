const MongoClient = require("mongodb").MongoClient

export default class MongoDB {
  constructor(mongodbUri, databaseName) {
    this.mongodbUri = mongodbUri
    this.databaseName = databaseName
    this.database = null
  }

  async connect() {
    this.database = MongoClient.connect(this.mongodbUri).db(this.databaseName)
  }

  async querry(request) {
    return await this.database.collection(request.collection)
      .find(request.filter)
      .sort(request.sort)
      .limit(request.limit).toArray()
  }
}
