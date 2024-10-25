const User = require("../models/User");
const Device = require("../models/Device");
const jwt = require("jsonwebtoken");

// Create a new user
const createUser = async (req, res) => {
  const { name, email, password, avatar } = req.body;
  try {
    const user = new User({ name, email, password, avatar });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a device to a user
const addUserDevice = async (req, res) => {
  const { id } = req.params;
  const { deviceName, wattage, quantity, category } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const device = new Device({ deviceName, wattage, quantity, category, user: id });
    await device.save();
    user.devices.push(device._id);
    await user.save();

    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    // Get the token from cookies
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const userId = decoded.id;

    // Fetch the user details from the database based on the userId
    const user = await User.findById(userId).select('-password'); // Exclude the password field

    // If the user is not found, return a 404 status
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createUser, addUserDevice, getUserDetails };