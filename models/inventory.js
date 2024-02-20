const { getDb } = require("../util/database");

module.exports = class Inventory {
  constructor(data) {
    const {
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
