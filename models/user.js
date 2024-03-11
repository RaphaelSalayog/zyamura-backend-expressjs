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

    // if (userData.username) {
    //   this.credentials.username = userData.username;
    // }
    // if (userData.password) {
    //   this.credentials.password = userData.password;
    // }
    // if (userData.newPassword) {
    //   this.credentials.newPassword = userData.newPassword;
    // }
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

  static async saveUserInformation(userInfo) {
    const { _id, ...restData } = userInfo;
    const db = getDb();
    try {
      return await db.collection("user").updateOne(
        { _id: new ObjectId(userInfo._id) },
        {
          $set: restData,
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAllUsers() {
    const db = getDb();
    try {
      return await db
        .collection("user")
        .aggregate([
          {
            $project: {
              _id: 1, // 1 = Include the key | 0 = Exclude the key if you don't need it
              firstName: 1,
              lastName: 1,
              fullName: { $concat: ["$firstName", " ", "$lastName"] },
              address: 1,
              phoneNumber: 1,
              email: 1,
              birthDate: 1,
              role: 1,
              "credentials.username": 1,
              profilePicture: 1,
              // Add other fields you want to include
            },
          },
          {
            $unset: "credentials.password", // Exclude the credentials.password field
          },
        ]) // 'project({ credentials: 0 })' to remove credentials key from the response data. 0 = exclude the key, 1 = it will only retrieve the specified key
        .toArray();

      // db.collection("user").find().project({ credentials: 0 }).toArray(); // 'project({ credentials: 0 })' to remove credentials key from the response data
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(_id) {
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

  static async deleteById(_id) {
    const db = getDb();
    try {
      return await db.collection("user").deleteOne({ _id: new ObjectId(_id) });
    } catch (err) {
      console.log(err);
    }
  }
};
