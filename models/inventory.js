const { getDb } = require("../util/database");

module.exports = class Inventory {
  constructor(name) {
    this.name = name;
  }

  async save() {
    const db = getDb();
    try {
      return await db.collection("inventory").insertOne(this);
    } catch (error) {
      console.log(error);
    }
  }

  static async fetchAll() {
    const db = getDb();
    const result = await db.collection("inventory").find().toArray();

    return result;
  }
};
