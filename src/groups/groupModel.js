const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupname: { type: String, required: true, unique: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    groupOwner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    groupAdmin: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    token: String,
    expDate: Date,
  },
  { timestamps: true }
);

const Group = mongoose.model("group", groupSchema);

module.exports = Group;
