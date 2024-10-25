const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute.js");
const authRoute = require("./routes/authRoute.js");  // Added auth routes
const deviceRoute = require("./routes/deviceRoute.js");  // Added device routes

const app = express();
require("dotenv").config();

// Connect to the database
connectDB();

// Middleware for JSON parsing and CORS
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL, // Replace with your frontend origin
  credentials: true
}));
app.use(cookieParser());

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server with CORS enabled
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Allow the frontend to connect
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Handle client connections via Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  const sendWeatherUpdates = () => {
    const mockWeather = {
      temperature: (20 + Math.random() * 10).toFixed(2),
      humidity: (50 + Math.random() * 20).toFixed(2),
      windSpeed: (5 + Math.random() * 5).toFixed(2),
      forecast: ['Sunny', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 4)],
    };
    socket.emit('weatherUpdate', mockWeather); // Send the weather update to the client
    
      // io.emit('notification', { message: 'New notification!', type: 'info' });
  };

  const interval = setInterval(sendWeatherUpdates, 5000);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    clearInterval(interval);
  });
});

// Start the Socket.IO server on port 3001
server.listen(3001, () => {
  console.log('Socket.IO server is listening on port 3001');
});



// API routes
app.use("/api/auth", authRoute);  // Auth routes
app.use("/api/user", userRoute);  // User routes
app.use("/api/device", deviceRoute);  // Device routes

// Start the Express server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));
