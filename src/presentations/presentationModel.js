const mongoose = require("mongoose");

const presentationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String },
    slides: [
      {
        question: { type: String, required: true },
        answers: { type: Array, default: [] },
      },
    ],
    presentationId: { type: String },
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Presentation = mongoose.model("presentation", presentationSchema);

module.exports = Presentation;
