const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

module.exports = class Transaction {
  constructor(data) {
    this.data = data;
  }

  async save() {
    const db = getDb();
    try {
      await db.collection("transaction").insertOne(this);
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    const db = getDb();
    try {
      return await db.collection("transaction").find().toArray();
    } catch (err) {
      console.log(err);
    }
  }
};
