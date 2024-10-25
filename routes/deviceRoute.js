const express = require("express");
const { getAllDevices, getDevice, createDevice, updateDevice, deleteDevice } =  require("../controllers/deviceController.js"); 
const { verifyToken } =  require("../middleware/verifyToken.js");
const deviceRoute = express.Router();

// All devices
deviceRoute.get("/",verifyToken,  getAllDevices);
// New Post
deviceRoute.post("/", verifyToken, createDevice);
// Individual device
deviceRoute.get("/:id", getDevice);
// update device
deviceRoute.put("/:id", verifyToken, updateDevice);
// delete device
deviceRoute.delete("/:id", verifyToken, deleteDevice);

module.exports = deviceRoute;