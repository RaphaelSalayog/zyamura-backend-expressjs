const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const { postSignup, postLogin, getLogin } = require("../controllers/auth");

router.get("/login", isAuth, getLogin);
router.post("/login", postLogin);
router.post("/signup", postSignup);

module.exports = router;
