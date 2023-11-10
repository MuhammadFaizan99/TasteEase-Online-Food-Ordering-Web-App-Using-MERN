var mongoose = require("mongoose");

const chefSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Experience: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    enum: ["Head Chef", "French Pastries", "BBQ Delights"],
    required: true,
  },
  Speciality: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
});
const chefModel = mongoose.model("team", chefSchema);
module.exports = { chefModel };
