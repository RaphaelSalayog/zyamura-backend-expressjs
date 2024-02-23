const { getDb } = require("../util/database");

module.exports = class User {
  constructor(userData) {
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.address = userData.address;
    this.phoneNumber = userData.phoneNumber;
    this.email = userData.email;
    this.birthDate = userData.birthDate;
    this.role = userData.role;
    this.credentials = {
      username: userData.username,
      password: userData.password,
    };
    this.profilePicture = userData.profilePicture;
  }

  async save() {
    const db = getDb();
    try {
      return await db.collection("user").insertOne(this);
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchUser(username) {
    const db = getDb();
    try {
      const user = await db
        .collection("user")
        .findOne({ "credentials.username": username });
      return user;
    } catch (err) {
      console.log(err);
    }
  }
};
