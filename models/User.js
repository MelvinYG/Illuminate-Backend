const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname:{
        type: String,
        required: true,
        minlength: 3
    },
    lastname:{
        type: String,
        required: true,
        minlength: 3
    },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  devices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
