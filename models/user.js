const { getDb } = require("../util/database");

module.exports = class User {
  constructor(email, password, name, role) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
  }

  async save() {
    const db = getDb();
    try {
      return await db.collection("user").insertOne(this);
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchUser(email) {
    const db = getDb();
    try {
      const user = await db.collection("user").findOne({ email: email });
      return user;
    } catch (err) {
      console.log(err);
    }
  }
};
