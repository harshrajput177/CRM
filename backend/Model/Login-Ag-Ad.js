const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
  userId: { type: String, unique: true },
    name: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6 },

    // ✅ New fields
    role: { 
      type: String, 
      enum: ["admin", "user"], // sirf ye do roles allow
      default: "user" 
    },
    image: { 
      type: String, 
      default: "" // profile image ka URL
    },
    phone: { 
      type: String, 
      trim: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"] 
    },
  },
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);

module.exports = { User };




