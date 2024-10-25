const Device =  require("../models/Device.js");
const User = require("../models/User.js");

// Get All Devices of Logged-in User ------------- //

const getAllDevices = async (req, res) => {
    const tokenUserId = req.userId; // Assumed you have userId from JWT token
    try {
        // Find all devices that belong to the logged-in user
        const userDevices = await Device.find({ userId: tokenUserId });
        res.status(200).json(userDevices);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// Get Single Device of the User ------------- //

const getDevice = async (req, res) => {
    const deviceId = req.params.id;
    const tokenUserId = req.userId;
    try {
        const device = await Device.findById(deviceId);

        // Check if the device belongs to the logged-in user
        if (!device || device.userId.toString() !== tokenUserId) {
            return res.status(403).json({ message: "Access denied" });
        }
        res.status(200).json(device);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// Create new Device (only for the logged-in user) ----------- //

const createDevice = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        // Create a new device with the user's ID
        const newDevice = new Device({
            ...body,
            userId: tokenUserId // Associate device with the logged-in user
        });
        
        // Save the new device to the database
        const savedDevice = await newDevice.save();

        // Find the user and update their devices array with the new device's ID
        const user = await User.findByIdAndUpdate(
            tokenUserId,
            { $push: { devices: savedDevice._id } }, // Push the device ID to the user's devices array
            { new: true } // Return the updated user object
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the new device information in the response
        res.status(201).json(savedDevice);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create device" });
    }
}


// Update Device (only if the device belongs to the logged-in user) --------------- //

const updateDevice = async (req, res) => {
    const deviceId = req.params.id;
    const tokenUserId = req.userId;
    try {
        const device = await Device.findById(deviceId);

        // Only allow update if the device belongs to the logged-in user
        if (device.userId.toString() !== tokenUserId) {
            return res.status(403).json({ message: "Not authorized to update this device" });
        }

        const updatedDevice = await Device.findByIdAndUpdate(
            deviceId, 
            { $set: req.body }, 
            { new: true }
        );
        res.status(200).json(updatedDevice);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update device" });
    }
}

// Delete Device (only if it belongs to the logged-in user) ----------- //

const deleteDevice = async (req, res) => {
    const deviceId = req.params.id;
    const tokenUserId = req.userId;
    try {
        const device = await Device.findById(deviceId);

        // Only allow deletion if the device belongs to the logged-in user
        if (device.userId.toString() !== tokenUserId) {
            return res.status(403).json({ message: "Not authorized to delete this device" });
        }

        await device.deleteOne();
        res.status(200).json({ message: "Device deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete device" });
    }
}

module.exports = {getAllDevices, getDevice, createDevice, updateDevice, deleteDevice};
