const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const {
  getTransaction,
  postTransaction,
} = require("../controllers/transaction");

router.get("", isAuth, getTransaction);
router.post("", isAuth, postTransaction);

module.exports = router;
