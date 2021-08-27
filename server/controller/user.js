const User = require("../model/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      res.status(403).json({
        error: "No user was found in db",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  return res.json(req.profile);
};
