const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

module.exports = class User {
  constructor(userData) {
    this._id = userData._id;
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

    let dbOperation;
    if (this._id) {
      const {
        firstName,
        lastName,
        phoneNumber,
        email,
        credentials: { password },
      } = this;

      dbOperation = db.collection("user").updateOne(
        { _id: new ObjectId(this._id) },
        {
          $set: {
            firstName,
            lastName,
            phoneNumber,
            email,
            "credentials.password": password,
          },
        }
      );
    } else {
      dbOperation = db.collection("user").insertOne(this);
    }

    try {
      return await dbOperation;
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

  static async fetchUserById(_id) {
    const db = getDb();
    try {
      const user = await db
        .collection("user")
        .findOne({ _id: new ObjectId(_id) });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteData(_id) {
    const db = getDb();
    try {
      return await db.collection("user").deleteOne({ _id: new ObjectId(_id) });
    } catch (err) {}
  }
};
