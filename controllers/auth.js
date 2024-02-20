const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User(email, hashedPw, "Paeng", "admin");
      user.save();
      res.json({ message: "Signup successful", user: user });
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

    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) {
      res.json({ token: "token" });
    }
  } catch (err) {}
};
