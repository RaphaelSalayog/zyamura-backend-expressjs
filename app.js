const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const { mongoConnection } = require("./util/database");
const inventory = require("./routes/inventory");
const auth = require("./routes/auth");

const app = express();

// used to get the token from cookie in client side. Components > login > forms > LoginForms.tsx > await fetch(url, { credentials: "include" });
const corsOptions = {
  origin: true,
  credentials: true,
};

// app.use(bodyParser.urlencoded({ extended: false })); // used for forms
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/images", express.static(path.join(__dirname, "images"))); // to access the images folder from client side by using a url <img src={'http://localhost:3000/images\\inventory\\2024-02-29T10-47-00.961Z-4.png'}/>

app.use(inventory);
app.use(auth);

app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;

  res.status(statusCode).json({ message: message, statusCode: statusCode });
});

mongoConnection(() => {
  const server = app.listen(process.env.PORT || 3000);
  const io = require("./socket").init(server);
  // the 'on' in io.on is used to attach event listeners to specific events. the code is listening for the "connection" event, which is a built-in event in Socket.IO.
  io.on("connection", (socket) => {
    console.log("Client connected");
  });
});

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folderPath =
//       file.fieldname === "profilePicture" ? "user" : "inventory";
//     cb(null, `images/${folderPath}`);
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
//     );
//   },
// });

// // use const formData = FormData() in client side to accept the text and file when using multer
// // use multer().single('profilePicture') if you only have 1 file upload
// app.use(
//   multer({ storage: fileStorage }).fields([
//     {
//       name: "profilePicture",
//       maxCount: 1,
//     },
//     { name: "inventoryImage", maxCount: 1 },
//   ])
// );
