const User = require("../model/user");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      res.status(400).json({ err: "not able to save user in Database" });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(403).json({ error: "USER email doesnot exist" });
    }
    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "email or password doesnot match",
      });
    }
    // generate token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // console.log(token);
    // put token in to cookie
    res.cookie("token", token, { expire: new Date() + 999 });
    // send response to the frontend
    const { _id, name, email, role } = user;
    res.json({
      token,
      user: {
        _id,
        name,
        email,
        role,
      },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.send({
    message: "User Signout Successfully",
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access denied",
    });
  }
  next();
};
