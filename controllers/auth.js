const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.status(200).json({
    message: "Successfully logged in",
  });
};

exports.postSignup = (req, res, next) => {
  const { password, ...userData } = req.body;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      userData.password = hashedPw;
      const user = new User(userData);
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "Signup successful", userId: result.insertedId });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.fetchUser(email);
    if (!user) {
      const error = new Error("Invalid Username");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "secrettoken",
      { expiresIn: "12h" }
    );
    res.status(200).json({
      token: token,
      user: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    if (!err.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  }
};
