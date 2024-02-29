const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.status(200).json({
    message: "Successfully logged in",
  });
};

exports.postSignup = async (req, res, next) => {
  if (!req.file) {
    const error = new Error(
      "Please upload images in JPEG, JPG, or PNG format only."
    );
    error.statusCode = 422;
    throw error;
  }

  try {
    const _id = await User.fetchUser(req.body.username);
    if (_id) {
      const error = new Error("Username already exist.");
      error.statusCode = 409;
      throw error;
    }

    const { password, ...userData } = req.body;
    userData.profilePicture = req.file.path;

    const hashedPw = await bcrypt.hash(password, 12);
    userData.password = hashedPw;
    const user = new User(userData);
    await user.save();

    res
      .status(201)
      .json({ message: "Signup successful", userId: user.insertedId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
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
      { expiresIn: "24h" }
    );

    // To add the token in cookie to access it in server side rendering in next js (Check it in Inventory page in next js)
    res.setHeader(
      "Set-Cookie",
      `token=${token}; Max-Age=${60 * 60 * 24}; HttpOnly; Secure;`
    );
    res.status(200).json({
      token: token,
      user: user._id.toString(),
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
    const data = await User.findById(_id);
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
  let imageUrl = req.body.profilePicture;

  try {
    if (!req.file) {
      const error = new Error(
        "Please upload images in JPEG, JPG, or PNG format only."
      );
      error.statusCode = 422;
      throw error;
    }

    if (req.file.path) {
      imageUrl = req.file.path;
    }

    const fetchedUser = await User.findById(_id);
    if (!fetchedUser) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

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

    if (imageUrl !== fetchedUser.profilePicture) {
      clearImage(fetchedUser.profilePicture);
    }
    const hashedPw = await bcrypt.hash(newPassword, 12);
    const data = {
      _id,
      password: hashedPw,
      profilePicture: imageUrl,
      ...req.body,
    };
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

exports.deleteUser = async (req, res, next) => {
  const _id = req.params.userId;

  try {
    const data = User.findById(_id);
    if (!data) {
      const error = new Error("Could not find item or pet");
      error.statusCode = 404;
      throw error;
    }
    clearImage(data.profilePicture);

    const response = await User.deleteById(_id);
    console.log(response);

    res.status(200).json({
      message: "Delete user successfully",
      _id: _id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
