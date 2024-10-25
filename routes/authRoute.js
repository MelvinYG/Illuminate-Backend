const express = require("express");
const { signUp, logIn, logOut } = require("../controllers/authController.js");
const authRoute = express.Router();

authRoute.post("/signup", signUp);

authRoute.post("/login", logIn);

authRoute.post("/logout", logOut);

module.exports = authRoute;