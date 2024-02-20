const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const { mongoConnection } = require("./util/database");
const inventory = require("./routes/inventory");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false })); // used for forms
app.use(bodyParser.json({ limit: "50mb" }));
app.use(multer({ storage: fileStorage }).single("inventoryImage"));

app.use(inventory);

mongoConnection(() => {
  app.listen(3000);
});
