const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    verified: { type: Boolean, default: false },
    picture: { type: String },
    refreshToken: String,
    expireAt: { type: Date, expires: 30 },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
