const { ObjectId } = require("mongodb");

const { getDb } = require("../util/database");

module.exports = class Inventory {
  constructor(data) {
    const {
      _id,
      object,
      name,
      supplier,
      description,
      sellingPrice,
      investmentCost,
      category,
      gender,
      type,
      quantity,
      imageUrl,
    } = data;

    this._id = _id;
    this.object = object;
    this.name = name;
    this.supplier = supplier;
    this.description = description;
    this.sellingPrice = sellingPrice;
    this.investmentCost = investmentCost;
    this.category = category;
    this.gender = gender;
    this.type = type;
    this.quantity = quantity;
    this.imageUrl = imageUrl;
  }

  async save() {
    const db = getDb();

    let dbOperation;
    if (this._id) {
      const { _id, ...restData } = this;
      dbOperation = db
        .collection("inventory")
        .updateOne({ _id: new ObjectId(this._id) }, { $set: restData });
    } else {
      dbOperation = db.collection("inventory").insertOne(this);
    }

    try {
      return await dbOperation;
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    const db = getDb();
    try {
      return await db.collection("inventory").find().toArray();
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(_id) {
    const db = getDb();
    try {
      return await db
        .collection("inventory")
        .findOne({ _id: new ObjectId(_id) });
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteById(_id) {
    const db = getDb();
    try {
      return await db
        .collection("inventory")
        .deleteOne({ _id: new ObjectId(_id) });
    } catch (err) {
      console.log(err);
    }
  }
};
