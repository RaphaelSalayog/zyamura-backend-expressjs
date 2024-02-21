const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const {
  getInventory,
  postInventory,
  updateInventory,
  //   deleteInventory,
} = require("../controllers/inventory");

router.get("/inventory", isAuth, getInventory);
router.post("/inventory", isAuth, postInventory);
router.patch("/inventory", isAuth, updateInventory);
// router.delete("/inventory", isAuth, deleteInventory);

module.exports = router;
