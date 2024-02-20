const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User(email, hashedPw, "Paeng", "admin");
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "Signup successful", userId: result._id });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.fetchUser(email);
    if (!user) {
      throw Error("Invalid");
    }

    const isEqual = bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw Error("Invalid");
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "secrettoken",
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({
        token: token,
        user: user.name,
        email: user.email,
        role: user.role,
      });
  } catch (err) {}
};
