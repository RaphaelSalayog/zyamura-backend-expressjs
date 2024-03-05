const fs = require("fs");
const path = require("path");

const io = require("../socket");
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
    const data = {
      ...req.body,
      sellingPrice: Number(req.body.sellingPrice),
      investmentCost: Number(req.body.investmentCost),
      quantity: Number(req.body.quantity),
      imageUrl: req.file.path,
    }; // use const formData = FormData() in client side to accept the text and file

    const inventory = new Inventory(data);
    const result = await inventory.save();

    // Web socket
    io.getIo().emit("inventory", { action: "create", inventory: inventory });

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
    // inventoryId is a dynamic variable for link. (Check it in routes > inventory.js)
    const _id = req.params.inventoryId;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    }
    const data = {
      _id: _id,
      ...req.body,
      sellingPrice: Number(req.body.sellingPrice),
      investmentCost: Number(req.body.investmentCost),
      quantity: Number(req.body.quantity),
      imageUrl: imageUrl,
    };

    if (!imageUrl) {
      const error = new Error("No file picked");
      error.statusCode = 422;
      throw error;
    }

    const response = await Inventory.findById(_id);
    if (!response) {
      const error = new Error("Item not found");
      error.statusCode = 404;
      throw error;
    }
    if (imageUrl !== response.imageUrl) {
      clearImage(response.imageUrl);
    }

    const inventory = new Inventory(data);
    const result = await inventory.save();

    // Web socket
    io.getIo().emit("inventory", { action: "update", inventory: inventory });

    res.status(200).json({
      message: "Product updated successfully",
      post: result,
    });
  } catch (err) {
    if (req.file) {
      clearImage(imageUrl);
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteInventory = async (req, res, next) => {
  // inventoryId is a dynamic variable for link. (Check it in routes > inventory.js)
  const _id = req.params.inventoryId;

  try {
    const data = await Inventory.findById(_id);
    if (!data) {
      const error = new Error("Could not find item or pet");
      error.statusCode = 404;
      throw error;
    }
    clearImage(data.imageUrl);

    const response = await Inventory.deleteById(_id);

    // Web socket
    io.getIo().emit("inventory", { action: "delete", inventory: _id });

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

exports.deductQuantity = async (req, res, next) => {
  const data = req.body;

  try {
    const response = await Inventory.deductQuantityById(data);
    res
      .status(200)
      .json({ message: "Deduct quantity successful", data: response });
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
