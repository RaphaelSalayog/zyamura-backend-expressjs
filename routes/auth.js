const express = require("express");
const router = express.Router();

const { imageUploader } = require("../middleware/imageUploader");
const isAuth = require("../middleware/auth");
const {
  postSignup,
  postLogin,
  getLogin,
  getLogout,
  getUsers,
  getUserById,
  putUserInformation,
  putUserUsername,
  putUserPassword,
  deleteUser,
} = require("../controllers/auth");

router.get("/login", isAuth, getLogin);
router.post("/login", postLogin);
router.get("/logout", isAuth, getLogout);
router.post("/signup", imageUploader("user", "profilePicture"), postSignup);

router.get("/users", isAuth, getUsers);
router.get("/user", isAuth, getUserById);
router.put(
  "/user/information/:userId",
  isAuth,
  imageUploader("user", "profilePicture"),
  putUserInformation
);
router.put("/user/username/:userId", isAuth, putUserUsername);
router.put("/user/password/:userId", isAuth, putUserPassword);
router.delete(
  "/user/:userId",
  isAuth,
  imageUploader("user", "profilePicture"),
  deleteUser
);

module.exports = router;
