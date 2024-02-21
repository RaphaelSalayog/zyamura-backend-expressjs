const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // get Authorization value from headers in client side
  if (!req.get("Authorization")) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  const token = req.get("Authorization").split(" ")[1]; // get the token value and remove the Bearer
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secrettoken");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  // decodedToken.userId has a userId key because of jwt.sign() in auth.js file in controllers folder
  req.userId = decodedToken.userId;
  next();
};

// CLIENT SIDE
// To get the token from client side to server side to validate the token for every request
/* 
    fetch('http://localhost/login', {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
*/
