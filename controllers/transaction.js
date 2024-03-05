const Transaction = require("../models/transaction");

exports.postTransaction = (req, res, next) => {
  const data = req.body;

  const transaction = new Transaction(data);
  transaction.save();
  res.status(200).json({
    message: "Add transaction successfully",
    data: transaction,
  });
};
