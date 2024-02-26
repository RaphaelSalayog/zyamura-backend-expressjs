const multer = require("multer");

const imageUploader = (filderName, fieldName) => {
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `images/${filderName}`);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  // use const formData = FormData() in client side to accept the text and file when using multer
  // use multer().single('profilePicture') if you only have 1 file upload
  return multer({ storage: fileStorage, fileFilter: fileFilter }).single(
    fieldName
  );
};

exports.imageUploader = imageUploader;
