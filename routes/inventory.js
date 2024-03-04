const express = require("express");
const router = express.Router();

const { imageUploader } = require("../middleware/imageUploader");
const isAuth = require("../middleware/auth");
const {
  getInventory,
  postInventory,
  updateInventory,
  deleteInventory,
  deductQuantity,
} = require("../controllers/inventory");

router.get("", isAuth, getInventory);
router.post("", isAuth, imageUploader("inventory", "imageUrl"), postInventory);
router.put(
  "/:inventoryId",
  isAuth,
  imageUploader("inventory", "imageUrl"),
  updateInventory
);
router.delete("/:inventoryId", isAuth, deleteInventory);

router.patch("/deductQuantity", deductQuantity);

module.exports = router;
