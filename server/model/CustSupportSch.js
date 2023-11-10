const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Query: {
      type: String,
      required: true,
    },
    Resolved: {
      type: Boolean,
      default: false,
    },
    Answer: {
      type: String,
      default: "",
    },
    ResolvedAnswer: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const customerModel = mongoose.model("queries", customerSchema);

module.exports = { customerModel };
