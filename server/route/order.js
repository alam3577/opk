const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require("../controller/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controller/user");

const {
  getOrderById,
  createOrder,
  getAllOrders,
} = require("../controller/order");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual routes
//create
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  createOrder,
);
//read
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders,
);

module.exports = router;
