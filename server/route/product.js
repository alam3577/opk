const express = require("express");
const router = express.Router();
const { getUserById } = require("../controller/user");
const {
  getProductsById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  getAllProducts,
  updateProduct,
} = require("../controller/product");
const { isSignedIn, isAdmin, isAuthenticated } = require("../controller/auth");

// params
router.param("paramId", getProductsById);
router.param("userId", getUserById);

// actualRoutes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct,
);

// read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//delete route
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct,
);

// //update route
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct,
);

//listing route
router.get("/products", getAllProducts);

module.exports = router;
