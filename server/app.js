require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = process.env.PORT;
const cookieParser = require("cookie-parser");
const authRoutes = require("./route/auth");
const userRoutes = require("./route/user");
const cors = require("cors");

// rest object
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// myRoutes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// connection
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log("DB NOT CONNECTED", err);
  });

// assign port
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
