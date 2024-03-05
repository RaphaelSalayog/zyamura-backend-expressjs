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

exports.postTransaction = async (req, res, next) => {
  const data = req.body;

  const transaction = new Transaction(data);
  const result = await transaction.save();
  res.status(200).json({
    message: "Add transaction successfully",
    data: result,
  });
};
