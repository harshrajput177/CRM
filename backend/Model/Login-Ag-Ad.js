const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    name: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    image: { type: String, default: "" },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);





