const express = require("express");
const router = express.Router();

const { imageUploader } = require("../middleware/imageUploader");
const isAuth = require("../middleware/auth");
const {
  getInventory,
  postInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventory");

router.get("/inventory", isAuth, getInventory);
router.post(
  "/inventory",
  isAuth,
  imageUploader("inventory", "imageUrl"),
  postInventory
);
router.put(
  "/inventory/:inventoryId",
  isAuth,
  imageUploader("inventory", "imageUrl"),
  updateInventory
);
router.delete("/inventory/:inventoryId", isAuth, deleteInventory);

module.exports = router;
