const fs = require("fs");

const duplicateImage = (sourcePath, duplicatePath) => {
  // Read the content of the existing file
  fs.readFile(sourcePath, (readErr, data) => {
    if (readErr) {
      console.error("Error reading file:", readErr);
      return res.status(500).send("Internal Server Error");
    }

    // Write the content to a new file
    fs.writeFile(duplicatePath, data, (writeErr) => {
      if (writeErr) {
        console.error("Error writing file:", writeErr);
        return res.status(500).send("Internal Server Error");
      }

      console.log("File duplicated successfully!");
    });
  });
};

exports.duplicateImage = duplicateImage;
