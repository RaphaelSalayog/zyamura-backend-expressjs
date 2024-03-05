const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const { postTransaction } = require("../controllers/transaction");

router.post("", isAuth, postTransaction);

module.exports = router;
