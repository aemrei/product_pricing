import { MongoClient } from 'mongodb'

global.mongo = global.mongo || {}

export const connectToDB = async () => {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000,
    })

    console.log('connecting to DB')
    await global.mongo.client.connect()
    console.log('connected to DB')
  }

  const db = global.mongo.client.db()

  return { db, dbClient: global.mongo.client }
}
