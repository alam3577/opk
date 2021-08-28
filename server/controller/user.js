const User = require("../model/user");
const Order = require("../model/order");

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
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;

  return res.json(req.profile);
};

exports.getAllUser = (req, res) => {
  User.find().exec((err, user) => {
    if (err || !user) {
      res.status(403).json({
        error: "users not found",
      });
    }
    res.json(user);
  });
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id }) //this is populated by getUserById
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "no order in user account",
        });
      }
      return res.json(order);
    });
};
// push order in purchases
exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list"
        });
      }
      next();
    }
  );
};
