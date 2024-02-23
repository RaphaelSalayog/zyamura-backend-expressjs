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
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.fetchUser(username);
    if (!user) {
      const error = new Error("Invalid Username");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.credentials.password);
    if (!isEqual) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        username: user.credentials.username,
        userId: user._id.toString(),
      },
      "secrettoken",
      { expiresIn: "12h" }
    );
    res.status(200).json({
      token: token,
      user: user.firstName + " " + user.lastName,
      username: user.credentials.username,
      role: user.role,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  const _id = req.userId;

  try {
    const data = await User.fetchUserById(_id);
    const { credentials, ...restData } = data;

    res.status(200).json({
      message: "Fetched data successfully",
      data: restData,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putUser = async (req, res, next) => {
  const _id = req.params.userId;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  try {
    const fetchedUser = await User.fetchUserById(_id);
    if (!fetchedUser) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }
    console.log(fetchedUser);
    if (oldPassword) {
      const isEqual = await bcrypt.compare(
        oldPassword,
        fetchedUser.credentials.password
      );

      if (!isEqual) {
        const error = new Error("Invalid Password");
        error.statusCode = 400;
        throw error;
      }
    }

    if (newPassword) {
      const isEqual = await bcrypt.compare(
        newPassword,
        fetchedUser.credentials.password
      );

      if (isEqual) {
        const error = new Error(
          "New password must be different from the old password."
        );
        error.statusCode = 400;
        throw error;
      }
    }

    const hashedPw = await bcrypt.hash(newPassword, 12);
    const data = { _id, password: hashedPw, ...req.body };
    const user = new User(data);
    await user.save();

    res.status(200).json({ message: "Update successfully", _id: user._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
