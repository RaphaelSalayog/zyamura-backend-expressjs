const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { mongoConnection } = require("./util/database");
const inventory = require("./routes/inventory");

const app = express();

app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false })); // used for forms
app.use(bodyParser.json());

app.use(inventory);

mongoConnection(() => {
  app.listen(3000);
});
