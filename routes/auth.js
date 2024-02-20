const express = require("express");
const auth = require("../controllers/auth");

const router = express.Router();

router.put("signup", auth.signup);
