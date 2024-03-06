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

  const transaction = new Transaction(data);
  const response = await transaction.save();
  const result = await Transaction.findById(response.insertedId);
  const _id = result.transactionData._id;
  res.status(200).json(_id);
};
