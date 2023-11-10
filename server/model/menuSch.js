const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  time: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"],
    required: true,
  },
  image: { type: String, required: true },
});

const menuModel = mongoose.model("Menu", menuSchema);

module.exports = { menuModel };
