const { createHmac } = await import("crypto");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    encry_password: {
      type: Number,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchase: {
      type: Array,
      default: [],
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: Number, required: true },
    },
  },
  { timestamps: true },
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return _password;
  });

userSchema.method = {
  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

const User = mongoose.model("User", userSchema);
module.exports = User;
