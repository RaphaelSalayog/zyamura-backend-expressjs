const express = require("express");
const router = express.Router();

const { getInventory, postInventory } = require("../controllers/inventory");

router.get("/inventory", getInventory);
router.post("/inventory", postInventory);

module.exports = router;
