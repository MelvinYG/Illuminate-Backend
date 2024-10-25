const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true,
  },
  wattage: {
    type: Number,
    required: true,
  },
  deviceId:{
    type: String,
    unique: true,
  },
  category: {
    type: String,
    enum: ["Washing machine", "Dishwasher", "Bulb", "AC", "Ceiling fan", "Pump", "TV", "Mixer grinder"],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Device", deviceSchema);
