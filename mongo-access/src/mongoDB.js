const MongoClient = require("mongodb").MongoClient

module.exports = class MongoDB {
  constructor(mongoBbUri, databaseName) {
    this.mongoBbUri = mongoBbUri
    this.databaseName = databaseName
    this.database = null
  }

  async connect() {
    const connection = await MongoClient.connect(this.mongoBbUri)
    this.database = connection.db(this.databaseName)
  }

  querry(request) {
    return this.database.collection(request.collection)
      .find(request.find)
      .sort(request.sort)
      .limit(request.limit).toArray()
  }
}
