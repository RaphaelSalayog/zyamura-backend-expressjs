const fs = require("fs");

const Inventory = require("../models/inventory");

exports.getInventory = async (req, res, next) => {
  const data = await Inventory.fetchAll();
  res.send(data);
};

exports.postInventory = async (req, res, next) => {
  const data = { ...req.body, inventoryImage: req?.file?.path }; // use const formData = FormData() in client side to accept the text and file

  const inventory = await new Inventory(data);
  const result = await inventory.save();

  res.status(200).json({
    message: "Product created successfully",
    post: result,
  });
};

exports.updateInventory = async (req, res, next) => {
  let imageUrl = req.body.inventoryImage;
  if (req.file) {
    imageUrl = req.file.path;
  }
  const data = { ...req.body, inventoryImage: imageUrl };

  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }

  const inventory = await new Inventory(data);
  const result = await inventory.save();

  res.status(200).json({
    message: "Product updated successfully",
    post: result,
  });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
