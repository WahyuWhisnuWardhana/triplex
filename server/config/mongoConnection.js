require("dotenv").config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "twitter_database";
let database;

async function mongoConnect() {
  try {
    await client.connect();
    console.log("Successfully connected to mongodb");
    database = client.db(dbName);
    return database;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function getDatabase() {
  return database;
}

module.exports = { mongoConnect, getDatabase };
