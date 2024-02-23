const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const { mongoConnection } = require("./util/database");
const inventory = require("./routes/inventory");
const auth = require("./routes/auth");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath =
      file.fieldname === "profilePicture" ? "user" : "inventory";
    cb(null, `images/${folderPath}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

// app.use(bodyParser.urlencoded({ extended: false })); // used for forms
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

// use const formData = FormData() in client side to accept the text and file when using multer
// use multer().single('profilePicture') if you only have 1 file upload
app.use(
  multer({ storage: fileStorage }).fields([
    {
      name: "profilePicture",
      maxCount: 1,
    },
    { name: "inventoryImage", maxCount: 1 },
  ])
);

app.use(inventory);
app.use(auth);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  const message = error.message;

  res.status(status).json({ message: message });
});

mongoConnection(() => {
  app.listen(3000);
});
