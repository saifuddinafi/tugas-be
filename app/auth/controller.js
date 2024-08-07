const User = require("../user/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils");

const register = async (req, res, next) => {
  try {
    const payload = req.body;

    let user = new User(payload);
    await user.save();
    return res.json(user);
  } catch (error) {
    if (error & (error.name === "ValidationError")) {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const localStrategy = async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );
    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
    return done();
  } catch (error) {
    done(error, null);
  }
  done();
};

const login = async (req, res, next) => {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);

    if (!user)
      return res.json({ error: 1, message: "Email or password is incorrect" });

    let signed = jwt.sign(user, config.secretkey);

    await User.findByIdAndUpdate(user._id, { $push: { token: signed } });

    res.json({
      message: "Login Success",
      user: user,
      token: signed,
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  let token = getToken(req);

  let user = await User.findOneAndUpdate(
    {
      token: { $in: [token] },
    },
    { $pull: { token: token } },
    { useFindAndModify: false }
  );

  if (!token && !user) {
    return res.json({
      error: 1,
      message: "No user found",
    });
  }

  return res.json({
    error: 0,
    message: "Logout success",
  });
};

const me = (req, res, next) => {
  if (!req.user) {
    return res.json({
      error: 1,
      message: "You must login first",
    });
  }
  return res.json({
    error: 0,
    data: req.user,
  });
};

module.exports = {
  register,
  localStrategy,
  login,
  logout,
  me,
};
