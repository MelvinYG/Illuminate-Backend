const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Sign Up Controller
const signUp = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        console.log(firstname, lastname, email, password);

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // Create the new user
        const user = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            devices: [] // Start with an empty device array
        });

        // If devices are provided, add them
        // if (devices && devices.length > 0) {
        //     const deviceObjects = await Promise.all(devices.map(async (deviceData) => {
        //         const newDevice = new Device({ ...deviceData, user: user._id });
        //         await newDevice.save();
        //         return newDevice._id;
        //     }));
        //     user.devices.push(...deviceObjects);
        // }

        await user.save();
        console.log(`${firstname} ${lastname} has signed up!`);
        res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create user" });
    }
};

// Log In Controller
 const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare provided password with the stored hashed password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const age = 1000 * 60 * 60 * 24 * 7; // 1 week
        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_TOKEN_SECRET, 
            { expiresIn: age }
        );

        console.log(`${email} has logged in!`);
        const { password: userPassword, ...userInfo } = user.toObject(); // Exclude password
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,  // Uncomment this if using HTTPS
            sameSite: 'None', // for cross domain cookie sending
            maxAge: age
        })
        .status(200)
        .json(userInfo);  // Return user data along with devices (thanks to populate)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Log Out Controller
const logOut = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {signUp, logIn, logOut};