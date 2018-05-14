const MongoClient = require("mongodb").MongoClient

module.exports = class MongoDB {
  constructor(mongoDBUri, databaseName) {
    this.mongoDBUri = mongoDBUri
    this.databaseName = databaseName
    this.database = null
  }

  async connect() {
    const connection = await MongoClient.connect(this.mongoDBUri)
    this.database = connection.db(this.databaseName)
  }

  querry(request) {
    return this.database.collection(request.collection)
      .find(request.find)
      .sort(request.sort)
      .limit(request.limit).toArray()
  }
}
