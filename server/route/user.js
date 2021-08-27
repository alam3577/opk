const express = require("express");
const router = express.Router();
const { getUserById, getUser } = require("../controller/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controller/auth");

router.params("userId", getUserById);

router.get("user/:userId", getUser);
modulde.exports = router;
