const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const {
  getTransaction,
  getTransactionById,
  postTransaction,
} = require("../controllers/transaction");

router.get("", isAuth, getTransaction);
router.get("/:transactionId", isAuth, getTransactionById);
router.post("", isAuth, postTransaction);

module.exports = router;
