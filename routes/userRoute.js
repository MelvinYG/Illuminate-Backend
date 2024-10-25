const express = require("express");
const { createUser, addUserDevice, getUserDetails } = require("../controllers/userController.js");
const { verifyToken } = require("../middleware/verifyToken.js");
const userRoute = express.Router();

userRoute.get("/", getUserDetails);

// Create a new user (No token required)
userRoute.post("/", createUser);

// Add a device to a user (Token required)
userRoute.post("/user/:id/device", verifyToken, addUserDevice);

module.exports = userRoute;