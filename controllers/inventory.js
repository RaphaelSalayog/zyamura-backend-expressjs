const Inventory = require("../models/inventory");

exports.getInventory = async (req, res, next) => {
  const data = await Inventory.fetchAll();
  res.send(data);
};

exports.postInventory = async (req, res, next) => {
  const data = { ...req.body, inventoryImage: req.file.path };
  const inventory = await new Inventory(data);
  const result = await inventory.save();

  res.status(200).json({
    message: "Post created successfully",
    post: result,
  });
};
