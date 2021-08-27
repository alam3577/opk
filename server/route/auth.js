const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { signout, signup, signin } = require("../controller/auth");

router.get("/signout", signout);
router.post(
  "/signup",
  [
    body("name", "name should be atleast of 3 char").isLength({ min: 3 }),
    body("email", "email is required").isEmail(),
    body("password", "password should be atleast of 5 charecter").isLength({
      min: 5,
    }),
  ],
  signup,
);

router.post(
  "/signin",
  [
    body("email", "email is required").isEmail(),
    body("password", "password is required").isLength({
      min: 1,
    }),
  ],
  signin,
);

module.exports = router;
