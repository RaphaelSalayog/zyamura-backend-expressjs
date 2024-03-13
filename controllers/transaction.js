const path = require("path");

const { duplicateImage } = require("../middleware/duplicateImage");
const io = require("../socket");
const Transaction = require("../models/transaction");

exports.getTransaction = async (req, res, next) => {
  try {
    const response = await Transaction.fetchAll();
    res.status(200).json(response);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTransactionById = async (req, res, next) => {
  // transactionId is a dynamic variable for link. (Check it in routes > transaction.js)
  const transactionId = req.params.transactionId;
  try {
    if (!transactionId) {
      const error = new Error("Transaction not found!");
      error.statusCode = 404;
      throw error;
    }

    const response = await Transaction.findByTransactionId(transactionId);
    res.status(200).json(response);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postTransaction = async (req, res, next) => {
  const data = req.body;

  // to change the path of imageUrl
  const modifiedData = {
    ...data,
    transactionData: {
      ...data.transactionData,
      orderedItems: data.transactionData.orderedItems.map((item) => {
        const url = item.itemDetails.imageUrl.split("inventory");
        const modifiedUrl = url[0] + "transaction" + url[1];
        const data = {
          ...item,
          itemDetails: {
            ...item.itemDetails,
            imageUrl: modifiedUrl,
          },
        };
        return data;
      }),
    },
  };

  const transaction = new Transaction(modifiedData);
  const response = await transaction.save();
  const result = await Transaction.findById(response.insertedId);
  const _id = result.transactionData._id;

  // to duplicate the images
  const imageUrl = data.transactionData.orderedItems.map((item) => {
    const url = item.itemDetails.imageUrl.split("images\\")[1];
    const path = {
      folderName: url.split("\\")[0],
      fileName: url.split("\\")[1],
    };
    return path;
  });

  imageUrl.map((value) => {
    const sourcePath = path.join(
      __dirname,
      "..",
      "images",
      value.folderName,
      value.fileName
    );

    const duplicatePath = path.join(
      __dirname,
      "..",
      "images",
      "transaction",
      value.fileName
    );

    duplicateImage(sourcePath, duplicatePath);
  });

  io.getIo().emit("transaction", { action: "create", transaction: result });
  res.status(200).json(_id);
};
