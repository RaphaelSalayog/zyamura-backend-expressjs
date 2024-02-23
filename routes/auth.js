const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const {
  postSignup,
  postLogin,
  getLogin,
  getUserById,
  putUser,
  deleteUser,
} = require("../controllers/auth");

router.get("/login", isAuth, getLogin);
router.post("/login", postLogin);
router.post("/signup", postSignup);

router.get("/user", isAuth, getUserById);
router.put("/user/:userId", isAuth, putUser);
router.delete("/user/:userId", isAuth, deleteUser);

module.exports = router;
