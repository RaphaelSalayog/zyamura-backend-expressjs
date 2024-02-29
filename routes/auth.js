const express = require("express");
const router = express.Router();

const { imageUploader } = require("../middleware/imageUploader");
const isAuth = require("../middleware/auth");
const {
  postSignup,
  postLogin,
  getLogin,
  getLogout,
  getUserById,
  putUser,
  deleteUser,
} = require("../controllers/auth");

router.get("/login", isAuth, getLogin);
router.post("/login", postLogin);
router.get("/logout", isAuth, getLogout);
router.post("/signup", imageUploader("user", "profilePicture"), postSignup);

router.get("/user", isAuth, getUserById);
router.put(
  "/user/:userId",
  isAuth,
  imageUploader("user", "profilePicture"),
  putUser
);
router.delete(
  "/user/:userId",
  isAuth,
  imageUploader("user", "profilePicture"),
  deleteUser
);

module.exports = router;
