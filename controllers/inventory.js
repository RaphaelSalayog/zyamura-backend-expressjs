const fs = require("fs");

const Inventory = require("../models/inventory");

exports.getInventory = async (req, res, next) => {
  try {
    const data = await Inventory.fetchAll();
    res.send(data);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postInventory = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error(
        "Please upload images in JPEG, JPG, or PNG format only."
      );
      error.statusCode = 422;
      throw error;
    }
    const data = { ...req.body, inventoryImage: req.file.path }; // use const formData = FormData() in client side to accept the text and file

    const inventory = await new Inventory(data);
    const result = await inventory.save();

    res.status(200).json({
      message: "Product created successfully",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateInventory = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error(
        "Please upload images in JPEG, JPG, or PNG format only."
      );
      error.statusCode = 422;
      throw error;
    }

    const _id = req.params.inventoryId;
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

    const response = await Inventory.fetchById(_id);
    if (!response) {
      const error = new Error("Item not found");
      error.statusCode = 404;
      throw error;
    }

    const inventory = await new Inventory(data);
    const result = await inventory.save();

    res.status(200).json({
      message: "Product updated successfully",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteInventory = async (req, res, next) => {
  const _id = req.params.inventoryId;

  try {
    const response = await Inventory.deleteById(_id);

    if (response?.deletedCount === 0 || !response) {
      const error = new Error(
        "No document was deleted. Document not found or deletion failed."
      );
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      message: "Delete user successfully",
      _id: _id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
