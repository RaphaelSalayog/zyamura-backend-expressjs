const Inventory = require("../models/inventory");

exports.getInventory = async (req, res, next) => {
  const data = await Inventory.fetchAll();
  res.send(data);
};

exports.postInventory = async (req, res, next) => {
  const inventory = await new Inventory(req.body.name);
  const result = await inventory.save();

  res.status(200).json({
    message: "Post created successfully",
    post: result,
  });
};
