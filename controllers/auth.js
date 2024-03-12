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

exports.getLogout = (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.json({ success: true, message: "Logout successful" });
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
      const error = new Error("Username already exist!");
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
    if (req.file) {
      clearImage(req.file.path);
    }
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
    // We need to add const corsOptions = { origin: true, credentials: true, }; in cors() to be able to set the cookie in client side. (Check it in app.js)
    // To add the token in cookie to access it in server side rendering in next js (Check it in Inventory page in next js)
    res.cookie("token", token, {
      maxAge: 60 * 60 * 24 * 1000, // Cookie expires in 1 day
      httpOnly: true, // Cookie is accessible only through the server
      secure: process.env.NODE_ENV === "production", // Send cookie only over HTTPS in production
      sameSite: "strict", // Cookie is sent only to the same site
    });
    // res.setHeader(
    //   "Set-Cookie",
    //   `token=${token}; Max-Age=${60 * 60 * 24}; HttpOnly; Secure;`
    // );

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

exports.getUsers = async (req, res, next) => {
  // users information only
  try {
    const response = await User.fetchAllUsers();

    res.status(200).json(response);
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

exports.putUserInformation = async (req, res, next) => {
  const _id = req.params.userId;
  let imageUrl = req.body.profilePicture;

  try {
    if (req.file) {
      imageUrl = req.file.path;
    }

    let data = {
      _id,
      profilePicture: imageUrl,
      ...req.body,
    };

    const fetchedUser = await User.findById(_id);
    if (!fetchedUser) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    if (imageUrl !== fetchedUser.profilePicture) {
      clearImage(fetchedUser.profilePicture);
    }

    const response = await User.saveUserInformation(data);
    res
      .status(200)
      .json({ message: "Update user information successfully", _id: _id });
  } catch (err) {
    if (req.file) {
      clearImage(imageUrl);
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putUserUsername = async (req, res, next) => {
  const _id = req.params.userId;
  const data = { _id, ...req.body };

  try {
    const id = await User.findById(_id);
    if (!id) {
      const error = new Error("Could not find user!");
      error.statusCode = 404;
      throw error;
    }

    if (id.credentials.username === data.username) {
      const error = new Error(
        "Username must be different from the old username!"
      );
      error.statusCode = 422;
      throw error;
    }

    const fetchedUser = await User.fetchUser(data.username);
    if (fetchedUser) {
      const error = new Error("Username already exist!");
      error.statusCode = 409;
      throw error;
    }

    const response = await User.saveUserUsername(data);
    res
      .status(200)
      .json({ message: "Update username successfully!", _id: _id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putUserPassword = async (req, res, next) => {
  const _id = req.params.userId;
  let data = { _id, ...req.body };

  try {
    const user = await User.findById(_id);
    if (!user) {
      const error = new Error("Could not find user!");
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(
      data.newPassword,
      user.credentials.password
    );

    if (isEqual) {
      const error = new Error(
        "Password must be different from the old password!"
      );
      error.statusCode = 400;
      throw error;
    }

    const hashedPw = await bcrypt.hash(data.newPassword, 12);
    data = { ...data, password: hashedPw };

    const response = User.saveUserPassword(data);
    res
      .status(200)
      .json({ message: "Update password successfully!", _id: _id });
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
