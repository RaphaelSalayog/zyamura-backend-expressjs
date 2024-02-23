const { ObjectId } = require("mongodb");

const { getDb } = require("../util/database");

module.exports = class Inventory {
  constructor(data) {
    const {
      _id,
      inventoryObject,
      inventoryName,
      inventorySupplier,
      inventoryDescription,
      inventorySellingPrice,
      inventoryInvestmentCost,
      inventoryCategory,
      inventoryGender,
      inventoryType,
      inventoryQuantity,
      inventoryImage,
    } = data;

    this._id = _id;
    this.inventoryObject = inventoryObject;
    this.inventoryName = inventoryName;
    this.inventorySupplier = inventorySupplier;
    this.inventoryDescription = inventoryDescription;
    this.inventorySellingPrice = inventorySellingPrice;
    this.inventoryInvestmentCost = inventoryInvestmentCost;
    this.inventoryCategory = inventoryCategory;
    this.inventoryGender = inventoryGender;
    this.inventoryType = inventoryType;
    this.inventoryQuantity = inventoryQuantity;
    this.inventoryImage = inventoryImage;
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
      err.statusCode = 500;
      throw err;
    }
  }

  static async fetchAll() {
    const db = getDb();
    try {
      return await db.collection("inventory").find().toArray();
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }
  }
};
